var this_window = nw.Window.get(window);
const close_window = () => {
    this_window.close(true)
}

const close_save = () => {
    this_window.close();
}

const minimize = () => {
    this_window.minimize(true);
}

const input_changing = (obj) => {
    obj.value = obj.value.replace(/[^0-9;]+/g, '')
    let notes = obj.value.split(';')
        .filter(x=> x!= '')
        .map(x => {
            let nwx = parseInt(x);
            return nwx <= 10 ? nwx : 10;
        });
    document.getElementById('nota_final').innerText = Math.floor(
        notes.reduce((a, c) => a+c) / notes.length).toString();
    
}