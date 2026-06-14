import { defineConfig } from "vite";

export default defineConfig({
    base: "/owlbear-scene-transition/",

    build: {
        rollupOptions: {
            input: {
                main: "index.html",
                transition: "transition.html"
            }
        }
    }
});