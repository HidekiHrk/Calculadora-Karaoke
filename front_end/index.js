const fs = require('fs');

var saved = true;
var saved_path = '';

var this_window = nw.Window.get(window);

const remove_parent = obj => {
    let point_to_remove = obj.parentNode;
    point_to_remove.parentNode.removeChild(point_to_remove);
}

const create_point = (point_list_block, nota) => {
    let node = document.createElement('p');
    node.appendChild(document.createTextNode(`${nota} `));
    let node2 = document.createElement('button');
    node2.appendChild(document.createTextNode('x'));
    node2.addEventListener('click', () => { remove_parent(node2); saved = false; });
    node.appendChild(node2);
    node.id = `point${(point_list_block.childNodes.length + 1).toString()}`;
    node.className = 'point'
    return node;
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
                let node = create_point(point_list_block, nota.trim());
                point_list_block.appendChild(node);
                saved = false;
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
    let name_input = document.createElement('input'); name_input.className = 'name_input'
    name_input.type = 'text'; name_input.placeholder = 'Nome do Participante';
    name_input.addEventListener('input', () => { saved = false; })
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
    saved = false;
    return body_obj.insertBefore(p_block, body_obj.querySelector('#add_button'));
}

const open_or_close_menu = (type) => {
    let menu_obj = document.getElementById('menu_body');
    let vs = menu_obj.style.visibility
    switch(type){
        case 'button':
            menu_obj.style.visibility = vs == 'hidden' ? 'visible' : 'hidden';
            break;
        case 'menu':
            menu_obj.style.visibility = 'hidden';
            break;
        case 'app_body':
            menu_obj.style.visibility = 'hidden';
            break;
    }
}

const get_body_json = () => {
    let bdy = document.getElementById('body');
    let all_blocks = bdy.querySelectorAll('.p_block');
    let json = {};
    for(let x = 0; x < all_blocks.length; x++){
        let block = all_blocks[x];
        let name = block.querySelector('.name_input').value;
        let note_list = Array.from(block.querySelectorAll('.point')).map(z => {
            return parseInt(z.innerText.trim().replace(/[^0-9]/g, ''));
        });
        json[x.toString()] = { name: name, notes: note_list }
    }
    return json;
}

const open_project = () => {
    let link = document.createElement('input');
    link.type = 'file'; link.accept = '.krk';
    link.addEventListener('change', () => {
        let bdy = document.getElementById('body');
        let all_blocks = bdy.querySelectorAll('.p_block');
        for(let x = 0; x < all_blocks.length; x++){
            all_blocks[x].parentNode.removeChild(all_blocks[x]);
        }
        let json_str = fs.readFileSync(link.value).toString('UTF-8');
        let json = JSON.parse(json_str);
        saved = true;
        saved_path = link.value;
        Object.values(json).forEach(x => {
            let block = add_block();
            let name_block = block.querySelector('input.name_input');
            name_block.value = x.name;
            let point_list_block = block.querySelector('div.point_list');
            for(let z = 0; z < x.notes.length; z++){
                point_list_block.appendChild(
                    create_point(point_list_block, x.notes[z]));
            }
        })
    })
    link.click();
}

const save_project = (as) => {
    let jsonstr = JSON.stringify(get_body_json(), null, 4 );
    if(saved_path.length && !as){
        fs.writeFileSync(saved_path, jsonstr); return;
    }
    let link = document.createElement('input');
    link.type = 'file';
    link.setAttribute('nwsaveas', '');
    link.accept = '.krk'
    link.addEventListener('change', () => {
        try{
            fs.writeFileSync(link.value, jsonstr);
            saved_path = link.value; saved = true;
            alert('Salvo!')
        }
        catch(e) {}
    })
    link.click();
}

const export_to_txt = () => {
    let json = get_body_json();
    let link = document.createElement('input');
    link.type = 'file';
    link.setAttribute('nwsaveas', '');
    link.accept = '.txt';
    link.addEventListener('change', () => {
        let notes_array = [];
        for(let x = 0; x < Object.keys(json).length; x++){
            let obj = json[x.toString()];
            let final_note = !obj.notes.length ? 0 : (obj.notes.reduce(
                (pv, cv) => pv + cv) + (10 * obj.notes.length));
            let new_obj = { name: obj.name.length ? obj.name : 'Sem Nome', final_note: final_note }
            if(!notes_array.length){
                notes_array.push(new_obj)
            }
            else{
                repl:{
                    for(let z = 0; z < notes_array.length; z++){
                        if(notes_array[z].final_note >= final_note){
                            continue
                        }
                        notes_array.splice(z, 0, new_obj);
                        break repl;
                    }
                    notes_array.push(new_obj);
                }
            }
        }
        notes_array = notes_array.map((x, index) => {
            return `${index+1}º ${x.name} - Pontos: ${x.final_note}`;
        });
        try{
            fs.writeFileSync(link.value, notes_array.join('\n'));
            alert('Salvo!')
        }
        catch(e) {}
    })
    link.click();
}

const close_window = () => {
    if(!saved){
        if(!window.confirm("Deseja sair sem salvar?"))
            return;
    }
    this_window.close()
}

const minimize = () => {
    this_window.minimize(true);
}
