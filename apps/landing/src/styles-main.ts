import "./gallery.css";
import { mount } from "svelte";
import Styles from "./Styles.svelte";

mount(Styles, { target: document.getElementById("app") as HTMLElement });
