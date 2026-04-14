// this plugins should not work anymore (I thinhk)

/**
 * @wiki Forces summoner spell selection during champion select using keyboard shortcuts. Press Alt+J to set Smite+Flash (jungle) or Alt+L to set Heal+Flash (lane). Note: this plugin may no longer work with current client versions.
 * @author Elaina Da Catto
 * @usage
 * 1. Enter champion select
 * 2. Press **Alt+J** to force Smite + Flash (jungle role)
 * 3. Press **Alt+L** to force Heal + Flash (lane role)
 */
export class ForceJungLane {
    async forceJungle(): Promise<void> {
        await fetch("/lol-champ-select/v1/session/my-selection", {
            "headers": {
                "content-type": "application/json",
            },
            "body": "{\"spell1Id\":11,\"spell2Id\":4}",
            "method": "PATCH",
        });
    }
    
    async forceLane(): Promise<void> {
        await fetch("/lol-champ-select/v1/session/my-selection", {
            "headers": {
                "content-type": "application/json",
            },
            "body": "{\"spell1Id\":7,\"spell2Id\":4}",
            "method": "PATCH",
        });
    }
    
    main = () => {
        window.addEventListener("keydown", async (event): Promise<void> => {
            let key: string = event.key
            if (event.altKey && key=="j") { await this.forceJungle() }
            if (event.altKey && key=="l") { await this.forceLane() }
        })
    }
}