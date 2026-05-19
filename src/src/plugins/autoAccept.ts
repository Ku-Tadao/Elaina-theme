/**
 * @author Lyfhael
 * @modifier Elaina Da Catto
 */

import utils from '../utils/utils.ts';
import * as upl from "pengu-upl"
import { log, warn, error } from '../utils/themeLog.ts';

let queue_accepted: boolean = false
let player_declined: boolean = false
let auto_accept_timer: number | null = null

const MAX_AUTO_ACCEPT_DELAY = 15000;

function parseEventData(message: any): any {
	try {
		return JSON.parse(message["data"])[2]["data"];
	}
	catch {
		return null;
	}
}

/**
 * Automatically accepts the matchmaking ready check when a game is found.
 * @wiki Automatically accepts the matchmaking ready check when a game is found, so you don't have to click Accept manually.
 * @author Lyfhael
 * @modifier Elaina Da Catto
 * @usage
 * 1. Open League Client settings
 * 2. Navigate to **Elaina Theme** → **Plugin Settings**
 * 3. Enable **Auto Accept** to auto-accept queues
 * 4. Optionally, enable the **Auto Accept Button** to show a toggle in the lobby
 * @settings auto_accept, auto_accept_button
 */
export class AutoAccept {
	getAutoAcceptDelay(): number {
		const rawDelay = Number(ElainaData.get("auto_accept_delay"));

		if (!Number.isFinite(rawDelay) || rawDelay < 0) return 0;
		
		return Math.min(Math.floor(rawDelay), MAX_AUTO_ACCEPT_DELAY);
	}

	clearAutoAcceptTimer(): void {
		if (auto_accept_timer !== null) {
			window.clearTimeout(auto_accept_timer);
			auto_accept_timer = null;
		}
	}

	autoAcceptQueueButtonSelect() {
		const element = document.getElementById("autoAcceptQueueButton") as HTMLInputElement
		if (element?.hasAttribute("selected")) {
			ElainaData.set("auto_accept", false)
			element.removeAttribute("selected")
		}
		else {
			element?.setAttribute("selected", "true")
			ElainaData.set("auto_accept", true)
		}
	}
	
	fetch_or_create_champselect_buttons_container(): any {
		try {
			document.querySelector(".cs-buttons-container")?.remove()
		}
		catch {
			error("Error while removing old auto accept button")
		}

		const div = document.createElement("div")
		div.className = "cs-buttons-container"

		let nor = document.querySelector(".v2-footer-notifications.ember-view") as HTMLElement
		let tft = document.querySelector(".parties-footer-notifications.ember-view") as HTMLElement

		if (nor) {
			nor.append(div)
			return div
		}
		else if (tft) { 
			tft?.append(div)
			return div
		}
	}

	getReadyCheck = async (): Promise<any> => {
		try {
			const response = await fetch('/lol-matchmaking/v1/ready-check')
			if (!response.ok) return null;
			return await response.json();
		}
		catch {
			return null;
		}
	}

	didPlayerDeclineReadyCheck(readyCheck: any): boolean {
		return readyCheck?.playerResponse === "Declined";
	}

	canAcceptReadyCheck(readyCheck: any): boolean {
		if (!readyCheck) return false;
		if (this.didPlayerDeclineReadyCheck(readyCheck)) return false;
		if (readyCheck.state && readyCheck.state !== "InProgress") return false;
		return readyCheck.playerResponse === "None" || readyCheck.playerResponse === undefined;
	}

	acceptMatchmaking = async (): Promise<void> => {
		if (player_declined) return;
		const readyCheck = await this.getReadyCheck();
		if (utils.phase != "ReadyCheck" || !ElainaData.get("auto_accept") || !this.	canAcceptReadyCheck(readyCheck)) return;
		await fetch('/lol-matchmaking/v1/ready-check/accept', { method: 'POST' })
	}

	autoAcceptCallback = async (message: Object) => {
		utils.phase = parseEventData(message)
		if (utils.phase == "ReadyCheck" && ElainaData.get("auto_accept") && !queue_accepted) {
			queue_accepted = true
			player_declined = false
			const delay = this.getAutoAcceptDelay();

			this.clearAutoAcceptTimer();
			if (delay > 0) {
				auto_accept_timer = window.setTimeout(async () => {
					auto_accept_timer = null;
					if (utils.phase == "ReadyCheck" && ElainaData.get("auto_accept")) {
						await this.acceptMatchmaking()
					}
				}, delay);
			}
			else if (utils.phase == "ReadyCheck" && ElainaData.get("auto_accept")) {
				await this.acceptMatchmaking()
			}
		}
		else if (utils.phase != "ReadyCheck") {
			this.clearAutoAcceptTimer();
			queue_accepted = false
			player_declined = false
		}
	}

	readyCheckCallback = async (message: Object) => {
		const readyCheck = parseEventData(message);
		if (!readyCheck) return;

		if (this.didPlayerDeclineReadyCheck(readyCheck) || readyCheck.state !== "InProgress") {
			player_declined = this.didPlayerDeclineReadyCheck(readyCheck);
			this.clearAutoAcceptTimer();
			queue_accepted = false;
		}
	}


	createButton = async (element: HTMLElement) => {
		const newOption = document.createElement("lol-uikit-radio-input-option")
		const container = this.fetch_or_create_champselect_buttons_container()
		const Option2 = document.createElement("div")
		const delayInput = document.createElement("lol-uikit-flat-input")
		const delayInputElement = document.createElement("input")
		
		newOption.setAttribute("id", "autoAcceptQueueButton")
		newOption.setAttribute("onclick", "window.autoAcceptQueueButtonSelect()")
	
		Option2.classList.add("auto-accept-button-text")
		Option2.innerHTML = await getString("auto_accept")

		delayInput.id = "autoAcceptDelayInput"
		delayInput.title = await getString("auto_accept_delay")
		delayInput.style.cssText = "width: 82px; margin-left: 8px;"
		delayInputElement.type = "number"
		delayInputElement.min = "0"
		delayInputElement.max = String(MAX_AUTO_ACCEPT_DELAY)
		delayInputElement.step = "100"
		delayInputElement.placeholder = "ms"
		delayInputElement.value = String(this.getAutoAcceptDelay())
		delayInputElement.addEventListener("input", () => {
			const value = Math.min(Math.max(Number(delayInputElement.value) || 0, 0), MAX_AUTO_ACCEPT_DELAY)
			ElainaData.set("auto_accept_delay", value)
		})
		delayInput.append(delayInputElement)
	
		if (ElainaData.get("auto_accept")){
			newOption.setAttribute("selected", "")
		}
	
		if (element && !document.getElementById("autoAcceptQueueButton")) {
			if (ElainaData.get("auto_accept_button")) {
				container?.append(newOption)
				newOption.append(Option2)
				container?.append(delayInput)
			}
		}
	}

	main = (auto_accept_button: boolean = true) => {
		window.autoAcceptQueueButtonSelect = this.autoAcceptQueueButtonSelect

		upl.observer.subscribeToElementCreation(".v2-lobby-root-component.ember-view .v2-footer-notifications.ember-view",async (element: any) => {
			await this.createButton(element)
		})

		upl.observer.subscribeToElementCreation(".tft-footer-container.ember-view .parties-footer-notifications.ember-view",async (element: any) => {
			await this.createButton(element)
		})

		if (auto_accept_button) {
			utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', this.autoAcceptCallback)
			utils.subscribe_endpoint('/lol-matchmaking/v1/ready-check', this.readyCheckCallback)
		}
	} 
}
