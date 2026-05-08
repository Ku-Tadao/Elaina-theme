import * as upl from 'pengu-upl'
import { error } from '../../utils/themeLog';

export class RemoveGamemode {
    /**
     * Removes a DOM node if it exists.
     * @param obj The selector for the DOM node to remove.
     */
    removeNode(obj: string): void {
        try { 
            // If the element exists, remove it
            document.querySelector(obj)?.remove() 
        }
        catch (err: any) { error(`Can not remove ${obj}:`, err)}
    }

    removeSR5v5 = () => {
        this.removeNode("div[data-game-mode='CLASSIC']")
        this.removeNode("div[data-game-mode='SWIFTPLAY']")
        this.removeNode("lol-uikit-navigation-item[data-category='kVersusAI']")
        this.removeNode("lol-uikit-navigation-item[data-category='kTraining']")
    }

    removeTFT = () => {
        this.removeNode("div[data-game-mode='TFT']")
    }

    removeTFTNavbar = () => {
        this.removeNode(".menu_item_navbar_tft")
        upl.observer.subscribeToElementCreation(".menu_item_navbar_tft", (element: any)=>{
            element.remove()
        })
    }

    removeAram = () => {
        this.removeNode("div[data-game-mode='ARAM']")
    } 

    removeArena = () => {
        this.removeNode("div[data-game-mode='CHERRY']")
    } 

    removeCustomGameSection = () => {
        this.removeNode("lol-uikit-navigation-item[data-category='CreateCustom']")
        this.removeNode("lol-uikit-navigation-item[data-category='JoinCustom']")
    }

    removeGamemodes = () => {
        if (ElainaData.get("hide-summoner-rift-5v5")) this.removeSR5v5()
        if (ElainaData.get("hide-tft")) this.removeTFT()
        if (ElainaData.get("hide-aram")) this.removeAram()
        if (ElainaData.get("hide-arena")) this.removeArena()
        if (ElainaData.get("hide-custom-game-section")) this.removeCustomGameSection()
    }

    main = () => {
        if (ElainaData.get("hide-tft")) this.removeTFTNavbar()

        upl.observer.subscribeToElementCreation(".game-type-card", (element: any)=>{
            this.removeGamemodes()
        })

        upl.observer.subscribeToElementCreation(".parties-game-type-select-wrapper", (element: any)=>{
            this.removeGamemodes()

            // Click on the first gamemode after click on Play button
            element.querySelector('div:nth-child(2) div[class=parties-game-type-upper-half]').click()
        })
    }
}