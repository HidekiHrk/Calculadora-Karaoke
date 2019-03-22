var this_window = nw.Window.get(window);
const close_window = () => {
    this_window.close()
}

const minimize = () => {
    this_window.minimize(true);
}

const remove_parent = obj => {
    let point_to_remove = obj.parentNode;
    point_to_remove.parentNode.removeChild(point_to_remove);
}

const add_window = (element) => {
    nw.Window.open('front_end/add_note.html', {
        x: this_window.x + 30, y: this_window.y + 30,
        width: 353, height: 113,
        resizable: false, frame:false, transparent:true },
    win => {
        win.on('close', () => {
            win.hide();
            let point_block = element.parentNode;
            let point_list_block = document.querySelector(`div#${point_block.id} div.point_list`);
            if(point_list_block.getElementsByClassName('point').length < 3){
                let doc = win.window.document;
                let nota = doc.getElementById('nota_final').innerText;
                let node = document.createElement('p');
                node.appendChild(document.createTextNode(`${nota.trim()} `));
                let node2 = document.createElement('button');
                node2.appendChild(document.createTextNode('x'));
                node2.addEventListener('click', () => { remove_parent(node2) });
                node.appendChild(node2);
                node.id = `point${(point_list_block.childNodes.length + 1).toString()}`;
                node.className = 'point'
                point_list_block.appendChild(node);
            }
            else{
                alert('Este participante já possui 3 notas.')
            }
            if(win !== null)
                win.close(true);
        })
        win.on('closed', () => {
            win = null;
        })
    }
)}

const add_block = () => {
    let body_obj = document.getElementById('body');
    let divs = body_obj.getElementsByClassName('p_block');
    // Create p_block
    let p_block = document.createElement('div');
    p_block.className = 'p_block'; p_block.id = `p${divs.length + 1}`;
    // Create input for participant name
    let name_input = document.createElement('input');
    name_input.type = 'text'; name_input.placeholder = 'Nome do Participante';
    p_block.appendChild(name_input); // append input to p_block
    // Create a non-important text node that refers to "Notas:"
    let p_elem = document.createElement('p');
    p_elem.appendChild(document.createTextNode('Notas:'));
    p_elem.className = 'point_indicator'; p_block.appendChild(p_elem); // and append that to p_block
    // Create the point_list elem
    let point_list = document.createElement('div');
    point_list.className = 'point_list'; p_block.appendChild(point_list);
    // And create the add button xD
    let p_add = document.createElement('button');
    p_add.className = 'add_point'; p_add.appendChild(document.createTextNode('+'));
    p_add.addEventListener('click', () => { add_window(p_add) });
    p_block.appendChild(p_add) // and append that button to p_block q-
    // Create delete_button to take that block to trash after i'm creating this...
    let p_rem = document.createElement('button'); p_rem.className = 'remove_block';
    p_rem.appendChild(document.createTextNode('x'));
    p_rem.addEventListener('click', () => { remove_parent(p_rem) });
    p_block.appendChild(p_rem); // and append the f*cking block REMOVER to the p_block :)
    body_obj.insertBefore(p_block, body_obj.querySelector('#add_button'));
}