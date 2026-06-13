import "./style.css";
import OBR from "@owlbear-rodeo/sdk";
import { videos } from "./videos";
import { TRANSITION_KEY } from "./transition";

OBR.onReady(() => {

    const startButton =
        document.getElementById("start");

    const stopButton =
        document.getElementById("stop");

    startButton?.addEventListener("click", async () => {

        const input =
            document.getElementById("videoId");

        if (!(input instanceof HTMLInputElement)) {
            return;
        }

        const escolha =
            Number(input.value);

        let video;

        if (escolha === 5) {

            video =
                videos[
                    Math.floor(
                        Math.random()
                        * videos.length
                    )
                ];

        } else {

            video =
                videos.find(
                    v => v.id === escolha
                );

        }

        if (!video) {

            alert("Vídeo inválido.");

            return;
        }

        await OBR.room.setMetadata({
            [TRANSITION_KEY]: {
                ativa: true,
                video: video.url
            }
        });

    });

    stopButton?.addEventListener("click", async () => {

        await OBR.room.setMetadata({
            [TRANSITION_KEY]: {
                ativa: false
            }
        });

    });

});