window.addEventListener('load', async function () {
    const dropSearch = document.querySelector('#dropSearch');
    const dropDown = document.querySelector('#dropDown');
    const searchButton = document.querySelector('#btn1');
    
    function radom_search(search, button) {
        const randomsearch = ['nebula', 'moon', 'sun', 'orion', 'europa', 'asteroid belt', 'black hole']
        const randNum = Math.floor(Math.random() * randomsearch.length);
        search.value = randomsearch[randNum];
        button.click();
    }

    radom_search(dropSearch, searchButton);


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
            const name = item.data[0].title;

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
        // list for media types selected
        let mediaformat = []
        // getting the media type, and checking if it is checked, and if so pushing it to the media format list
        if (document.querySelector('#images').checked){mediaformat.push('image')}
        if (document.querySelector('#videos').checked){mediaformat.push('video')}
        // setting the main content area to nothing, to reset the images / videos
        main_container.innerHTML = '';
        // getting the search value from the text input
        const query = dropSearch.value.trim();
        // making the css loading bar to be visible
        document.querySelector("#load_bar").classList.remove ("hide");
        
        // setting the url to incorporate the media values as well as the search query
        const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=${mediaformat.join(',')}`
        try {
            const response = await fetch(url);
            const text = await response.text();
            const obj = JSON.parse(text);

            for (const item of obj.collection.items) {
                const data = item.data[0];
                const title = data.title;
                const link = item.links[0].href          
                const descr = data.description; 
                const media_type = data.media_type;

                console.log(descr);
                console.log(link);
                console.log(media_type);
                
                    const main = document.querySelector(".text");

                    const title_div = document.createElement("div");
                    title_div.classList.add('title');

                    const Title = document.createElement("h2");
                    Title.textContent = title;

                    title_div.appendChild(Title);

                    const div = document.createElement("div");
                    div.classList.add('text-div');

                    const newDiv = document.createElement("div");
                    newDiv.classList.add("container");

                    const description = document.createElement("p");
                    description.textContent = descr;

                    const keywords = document.createElement('div');
                    keywords.classList.add('hide');
                    keywords.id = 'keyword';
                    
                    if (data.keywords && data.keywords.length > 0) {
                        const keywordsText = data.keywords.map(keyword => {
                            return `<a href="#" class="keyword">${keyword}</a>`;
                        }).join(', ');
                        keywords.innerHTML = `Keywords: ${keywordsText}`;
                    } else {
                        keywords.textContent = 'Keywords: N/A';
                    }

                    newDiv.appendChild(title_div); 
                    
                    if (media_type === 'image') {
                        const newImg = document.createElement("img");
                        newImg.src = link;

                        newDiv.appendChild(newImg);
                    } else if (media_type === 'video') {
                        const newVideo = document.createElement("video");
                        newVideo.src = link;

                        newDiv.appendChild(newVideo);
                    }


                    div.appendChild(description);
                    div.appendChild(keywords);
                    newDiv.appendChild(div);
                    main.appendChild(newDiv);
                    document.querySelector("#load_bar").classList.add("hide");
                
            }

            console.log(text);
        } catch (e) {
            console.error(e);
        }
        });

    const main_container = document.querySelector('.text');
    main_container.addEventListener('click',  function(event) {
        const clickedContainer = event.target.closest('.container');
        
        if (clickedContainer) {
            const keywordsDiv = clickedContainer.querySelector('#keyword');
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
                                <div>
                                    Keywords: ${keywordsDiv ? Array.from(keywordsDiv.children).map(child => child.outerHTML).join(', ') : 'No keywords available'}                                
                                </div>
                            </div>
                       </div>
                    </div>
                    <button id="backButton">Go Back</button>
                </div>
                `;
            document.querySelector(".wrapper").style.padding = '30px';
            document.querySelector("#back2top").classList.add('hide');
            

        }

        const keywordLinks = document.querySelectorAll('.keyword');

// Add event listener to each keyword link
        keywordLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                dropSearch.value = e.target.innerText;  // Set the input value to the clicked keyword's text
                searchButton.classList.remove('hide');
                main_container.classList.add('text');
                dropSearch.classList.remove('hide');
                searchButton.click();  // Trigger the search button click   
            });
        });

        
        const searchButton = document.querySelector('#btn1');
        document.querySelector('#backButton').addEventListener('click',  function (e) {
            main_container.innerHTML = '';
            searchButton.classList.remove('hide');
            main_container.classList.add('text');
            dropSearch.classList.remove('hide');
            searchButton.click();
        })
    })
    document.querySelector('#back2top').addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
    });

    radom_search(dropSearch, searchButton);
});
