window.addEventListener('load', async function () {
    const dropSearch = document.querySelector('#dropSearch');
    const dropDown = document.querySelector('#dropDown');

    dropSearch.addEventListener('focusin', (event) => {
        if (document.activeElement === dropSearch) {
            console.log('Input is focused');
            dropDown.classList.remove('hide');
        }
    });

    dropSearch.addEventListener('focusout', (event) => {
        if (document.activeElement !== dropDown && !dropDown.contains(document.activeElement)) {
            console.log('Input is not focused');
            dropDown.classList.add('hide');
        }
    });

    try {
        const url = 'https://images-api.nasa.gov/search?q=center';
        const response = await fetch(url);
        const text = await response.text();
        const obj = JSON.parse(text);

        const dropdown = document.querySelector('#dropDown');
        const addedTitles = new Set(); // Track titles we've added

        for (const item of obj.collection.items) {
            const name = item.data[0].keywords;

            if (!addedTitles.has(name)) {
                const dropItem = document.createElement('p');
                dropItem.classList.add('drop-item');
                dropItem.textContent = name;

                dropdown.appendChild(dropItem);
                console.log(name + ": Was added to the drop down");

                addedTitles.add(name); // Mark this title as added
            }
        }
    } catch (e) {
        console.error(e);
    }

    // Handle search button click
    document.querySelector('#btn1').addEventListener('click', async function (ev) {
        const query = dropSearch.value.trim();

        // const searchterm = "Apollo 11";
        const url = 'https://images-api.nasa.gov/search?q=' + encodeURIComponent(query);

        try {
            const response = await fetch(url);
            const text = await response.text();
            const obj = JSON.parse(text);

            for (const item of obj.collection.items) {
                const link = item.links[0].href;
                const descr = item.data[0].description;

                console.log(descr);
                console.log(link);

                const main = document.querySelector(".text");
                
                const div = document.createElement("div");
                div.classList.add('text-div');

                const newDiv = document.createElement("div");
                newDiv.classList.add("container");

                const newImg = document.createElement("img");
                newImg.src = link;

                const description = document.createElement("p");
                description.textContent = descr;

                newDiv.appendChild(newImg);
                div.appendChild(description);
                newDiv.appendChild(div);
                main.appendChild(newDiv);
            }

            console.log(text);
        } catch (e) {
            console.error(e);
        }
        });
    
    const main_container = document.querySelector('.text');
    main_container.addEventListener('click', async function () {
        const clickedContainer = event.target.closest('.container');
        
        if (clickedContainer) {
            const img = clickedContainer.querySelector('img').getAttribute('src');
            const description = clickedContainer.querySelector('p').innerText;
            const searchButton = document.querySelector('#btn1');
            
            searchButton.classList.add('hide');
            dropSearch.classList.add('hide');
            main_container.classList.remove('text');
            main_container.innerHTML = `
                <div class="wrapper">
                    <div id="bigImg">
                        <div style="padding: 20px;">
                            <img class="big-img" src="${img}" alt="${description}">
                            <div>
                                <p class="text-div">${description}</p>
                            </div>
                       </div>
                    </div>
                    <button id="backButton">Go Back</button>
                </div>
                `;
            document.querySelector(".wrapper").style.padding = '30px';

        }
        const searchButton = document.querySelector('#btn1');
        document.querySelector('#backButton').addEventListener('click',  function (e) {
            main_container.innerHTML = '';
            searchButton.classList.remove('hide');
            main_container.classList.add('text');
            dropSearch.classList.remove('hide');
            searchButton.click();
            
        })
    })
    
});
