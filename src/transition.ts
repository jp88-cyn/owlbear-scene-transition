import "./style.css";
import OBR from "@owlbear-rodeo/sdk";

export const TRANSITION_KEY =
    "jp-aleatorio/scene-transition";

window.addEventListener("DOMContentLoaded", () => {

    const video =
        document.getElementById("transitionVideo");

    if (!(video instanceof HTMLVideoElement)) {
        return;
    }

    video.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    OBR.onReady(() => {

        OBR.room.onMetadataChange((metadata) => {

            const data =
                metadata[TRANSITION_KEY] as
                | {
                    ativa: boolean;
                    video?: string;
                }
                | undefined;

            if (!data?.ativa || !data.video) {

                video.pause();
                video.src = "";

                return;
            }

            if (video.src !== data.video) {

                video.src = data.video;

                video.play()
                .catch(() => {

                    console.log(
                        "Autoplay bloqueado."
                    );

                });

            }

        });

    });

});