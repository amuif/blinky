import "blinky-avatar";
import "@ui-sdk/core/web.css";
import "./app.css";
import { mount } from "svelte";
import App from "./App.svelte";

mount(App, { target: document.getElementById("app") as HTMLElement });
