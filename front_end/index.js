var this_window = nw.Window.get(window);
const close_window = () => {
    this_window.close()
}

const minimize = () => {
    this_window.minimize(true);
}

const add_window = (element) => {
    nw.Window.open('front_end/add_note.html', {
        x: this_window.x + 30, y: this_window.y + 30,
        width: 353, height: 113,
        resizable: false, frame:false, transparent:true },
    win => {
        
    }
)}