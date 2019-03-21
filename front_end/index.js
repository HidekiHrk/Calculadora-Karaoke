var this_window = nw.Window.get(window);
const close_window = () => {
    this_window.close()
}

const minimize = () => {
    this_window.minimize(true);
}
