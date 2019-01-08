let x_origin;
let y_origin;

function dragStart(event) {
    x_origin = event.pageX;
    y_origin = event.pageY;

    document.body.addEventListener("dragend", dragEnd, false);
}

function dragEnd(event) {
    let x_dragend = event.pageX;
    let y_dragend = event.pageY;
    let top_dragged_element = Number(event.target.style.top.replace('px', ''));
    let left_dragged_element = Number(event.target.style.left.replace('px', ''));
    event.target.style.top = (top_dragged_element - y_origin + y_dragend) + 'px';
    event.target.style.left = (left_dragged_element - x_origin + x_dragend) + 'px';
    document.body.removeEventListener("dragend", dragEnd, false);
}

chrome.extension.onRequest.addListener(function(){
    const image_elmnts = document.getElementsByTagName('IMG');
    for (let i = 0; i < image_elmnts.length; i++){
        let img_info_div = document.createElement('div');

        let img_src_addresses = image_elmnts[i].srcset.split(',');
        img_info_div.draggable = true;
        img_info_div.style.border = '2px solid #83CFF2';
        img_info_div.textContent = '';
        img_info_div.addEventListener('dragstart', dragStart, false);
        for (let j = 0; j < img_src_addresses.length; j++){
            if(img_src_addresses[j].includes('1x')){
                img_src_addresses[j] = img_src_addresses[j].replace('1x', '');
                img_src_addresses[j] = img_src_addresses[j].trim();
                let img_info_span_1x = document.createElement('span');
                img_info_span_1x.textContent += img_src_addresses[j];
                img_info_span_1x.style.display = 'block';
                let img_1x = document.createElement('img');
                img_1x.src = img_src_addresses[j];
                img_info_span_1x.appendChild(img_1x);
                img_info_div.appendChild(img_info_span_1x);
            }else if(img_src_addresses[j].includes('2x')){
                img_src_addresses[j] = img_src_addresses[j].replace(/(.*)2x/,"$1");
                img_src_addresses[j] = img_src_addresses[j].trim();
                let img_info_span_2x = document.createElement('span');
                img_info_span_2x.textContent += img_src_addresses[j];
                img_info_span_2x.style.display = 'block';
                let img_2x = document.createElement('img');
                img_2x.src = img_src_addresses[j];
                img_info_span_2x.appendChild(img_2x);
                img_info_div.appendChild(img_info_span_2x);
            }
        }
        let img_width = image_elmnts[i].getBoundingClientRect().width;
        let img_height = image_elmnts[i].getBoundingClientRect().height;
        image_elmnts[i].parentNode.style.position = 'relative';
        img_info_div.style.position = 'absolute';
        img_info_div.style.color = '#e74c3c';
        img_info_div.style.backgroundColor = '#fff';
        img_info_div.style.top = img_height + 'px';
        img_info_div.style.left = img_width + 'px';
        image_elmnts[i].parentNode.appendChild(img_info_div);
    }
})
