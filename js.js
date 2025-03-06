window.addEventListener('load', async function () {
    let links = []
    let isContainerClicked = false
    const dropSearch = document.querySelector('#dropSearch');
    const searchButton = document.querySelector('#btn1');
    
    function radom_search(search, button) {
        const randomsearch = ['nebula', 'moon', 'sun', 'orion', 'europa', 'asteroid belt', 'black hole']
        const randNum = Math.floor(Math.random() * randomsearch.length);
        search.value = randomsearch[randNum];
        button.click();
    }

    radom_search(dropSearch, searchButton);
    
    async function search_nasa() {
            // list for media types selected
            let mediaformat = []
            // getting the media type, and checking if it is checked, and if so pushing it to the media format list
            if (document.querySelector('#images').checked) {
                mediaformat.push('image')
            }
            if (document.querySelector('#videos').checked) {
                mediaformat.push('video')
            }
            // setting the main content area to nothing, to reset the images / videos
            main_container.innerHTML = '';
            // getting the search value from the text input
            const query = dropSearch.value.trim();
            // making the css loading bar to be visible
            document.querySelector("#load_bar").classList.remove("hide");
            document.querySelector("#back2top").classList.remove('hide');

            // setting the url to incorporate the media values as well as the search query
            const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=${mediaformat.join(',')}`
            try {
                const response = await fetch(url);
                const text = await response.text();
                const obj = JSON.parse(text);
                document.querySelector("#load_bar").classList.remove("hide");


                for (const item of obj.collection.items) {
                    if (isContainerClicked) return;

                    
                        const data = item.data[0];
                        const title = data.title;
                        const link = item.links[0].href;
                        links = item.links;
                        const descr = data.description;
                        const media_type = data.media_type;

                        console.log(descr);
                        console.log(link);
                        console.log(media_type);

                        const main = document.querySelector("#nasa_gallery");

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
                            // Make an additional fetch request to get the video URL
                            const assetUrl = item.href;
                            const videoResponse = await fetch(assetUrl);
                            const videoText = await videoResponse.text();
                            const videoObj = JSON.parse(videoText);

                            // Assuming the video URL is in the first item of the array
                            const videoUrl = videoObj[0];
                            console.log(videoUrl); // Check the URL in the console

                            const newVideo = document.createElement("video");
                            newVideo.src = videoUrl;
                            newVideo.controls = true; // Add video controls (play, pause, volume)

                            newVideo.onerror = () => {
                                newVideo.style.display = 'none'; // Hide the video if it fails to load
                            };

                            newDiv.appendChild(newVideo);

                        }
                    if (isContainerClicked) return;

                    div.appendChild(description);
                        div.appendChild(keywords);
                        newDiv.appendChild(div);
                        main.appendChild(newDiv);
                    

                    document.querySelector("#load_bar").classList.add("hide");
                }
                console.log(text);
            } catch (e) {
                console.error(e);
                const warn_div = document.querySelector('#warn');
                const text = "There is some trouble connecting to the server"
                const warning = document.createElement('p');
                warning.id = "warning";
                warning.textContent = text;
                warn_div.appendChild(warning);
            }
    }
    // Handle search button click
    document.querySelector('#btn1').addEventListener('click', search_nasa);

    
    // loading the main card for one image or video
    const main_container = document.querySelector('#nasa_gallery');
    main_container.addEventListener('click',  function(event) {
        isContainerClicked = true;
        
        //checking the number of containers against the list of media items, to se if all the images/ videos have been loaded
        const num_containers = main_container.querySelectorAll('.container').length;
        
        const clickedContainer = event.target.closest('.container');
        if (clickedContainer) {
            const backButton = document.querySelector('#backButton');
            const title = clickedContainer.querySelector('h2').textContent;
            const keywordsDiv = clickedContainer.querySelector('#keyword');
            const imageElement = clickedContainer.querySelector('img');
            const videoElement = clickedContainer.querySelector('video');
            const description = clickedContainer.querySelector('p').innerText;
            const searchButton = document.querySelector('#btn1');
            
            backButton.classList.remove('hide');
            searchButton.classList.add('hide');
            dropSearch.classList.add('hide');
            main_container.classList.remove('nasa_gallery');
            main_container.removeAttribute.id = "nasa_gallery";

            // Check for image or video and set variables accordingly
            let img = imageElement ? imageElement.getAttribute('src') : null;
            let video = videoElement ? videoElement.getAttribute('src') : null;

            searchButton.classList.add('hide');
            dropSearch.classList.add('hide');
            main_container.classList.remove('text');
            if (img){
                main_container.innerHTML = `
<!--                <div class="wrapper">-->
                    <div id="bigImg">
                             <h2>${title}</h2>
                            <img class="big-img" src="${img}" alt="${description}">
                            <div>
                                <p class="text-div">${description}</p>
                                <div>
                                    Keywords: ${keywordsDiv ? Array.from(keywordsDiv.children).map(child => child.outerHTML).join(', ') : 'No keywords available'}                                
                                </div>
                            </div>
                    </div>
<!--                </div>-->
                `;
            } else {
                main_container.innerHTML = `
<!--                <div class="wrapper">-->
                    <div id="bigImg">
                         <h2 class="text-title">${title}</h2>
                        <video class="big-img" src="${video}" controls autoplay></video>
                        
                        <div>
                            <p class="text-div">${description}</p>
                        <div>
                            Keywords: ${keywordsDiv ? Array.from(keywordsDiv.children).map(child => child.outerHTML).join(', ') : 'No keywords available'}                                
                        </div>
                        </div>
                    </div>
<!--                </div>-->
                `;
            }
            // document.querySelector(".wrapper").style.padding = '30px';
            document.querySelector("#back2top").classList.add('hide');
        } else {
            console.log("not all media have been loaded, plase wait")
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
    })
    
    const backButton = document.querySelector('#backButton');
    backButton.addEventListener('click',  function () {
        isContainerClicked = false;
        backButton.classList.add('hide');
        main_container.innerHTML = '';
        searchButton.classList.remove('hide');
        main_container.classList.add('text');
        dropSearch.classList.remove('hide');
        searchButton.click();
    })
    
    document.querySelector('#back2top').addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
    });

    radom_search(dropSearch, searchButton);
});
