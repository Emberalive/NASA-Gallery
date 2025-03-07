window.addEventListener('load', async function () {
    let isContainerClicked = false
    const containers = document.querySelectorAll('.container');
    const main_container = document.querySelector('#nasa_gallery');
    const dropSearch = document.querySelector('#dropSearch');
    const searchButton = document.querySelector('#btn1');
    const searchBar = document.querySelector('#searchBar');
    
    function radom_search(search, button) {
        const randomsearch = ['nebula', 'moon', 'sun', 'orion', 'europa', 'asteroid belt', 'black hole']
        const randNum = Math.floor(Math.random() * randomsearch.length);
        search.value = randomsearch[randNum];
        search_nasa()
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
                        const date = data.date;

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
                        div.classList.add('preview_descr');
                        div.innerHTML = descr;
                        
                        const newDiv = document.createElement("div");
                        newDiv.classList.add("container");

                        const keywords = document.createElement('div');
                        keywords.classList.add('hide');
                        keywords.id = 'keyword';
                        
                        const dateElement = document.createElement("p");
                        dateElement.textContent = date;
                        dateElement.classList.add('hide');
                        dateElement.setAttribute('id', 'date');

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

                    // div.appendChild(description);
                        newDiv.appendChild(dateElement);
                        div.appendChild(keywords);
                        newDiv.appendChild(div);
                        main.appendChild(newDiv);
                    document.querySelector("#back2top").classList.add('hide');

                    
                    // adding the event listener for each container
                    newDiv.addEventListener('click', (e) => {
                        isContainerClicked = true;

                        const backButton = document.querySelector('#backButton');
                        const titleText = newDiv.querySelector('h2').textContent;
                        const keywordsDiv = newDiv.querySelector('#keyword');
                        const imageElement = newDiv.querySelector('img');
                        const videoElement = newDiv.querySelector('video');
                        const description = newDiv.querySelector('.preview_descr').innerText;
                        const date = newDiv.querySelector('#date').textContent;

                        backButton.classList.remove('hide');
                        searchBar.classList.add('hide');
                        main_container.classList.remove('nasa_gallery');
                        main_container.removeAttribute.id = "nasa_gallery";

                        // Check for image or video and set variables accordingly
                        let img = imageElement ? imageElement.getAttribute('src') : null;
                        let video = videoElement ? videoElement.getAttribute('src') : null;

                        main_container.innerHTML = '';

                        main_container.classList.remove('text');
                        const main_div = document.createElement('div');
                        main_div.setAttribute('id', 'bigImg');

                        const title = document.createElement("h2")
                        title.textContent = titleText;

                        main_div.appendChild(title);
                        
                        const dateElement = document.createElement("p");
                        dateElement.textContent = date;

                        if (img) {
                            const imagElement = document.createElement('img');
                            imagElement.src = img;

                            main_div.appendChild(imageElement);
                        } else if (video) {
                            const videoElement = document.createElement('video');
                            videoElement.src = video;
                            videoElement.controls = true; // Add video controls (play, pause, volume)

                            main_div.appendChild(videoElement);
                        }

                        const descriptionDiv = document.createElement("div");
                        descriptionDiv.classList.add('text-div');
                        descriptionDiv.textContent = description

                        const keywordsElement = document.createElement('div');
                        keywordsElement.setAttribute('id', 'keywords');

                        const keywordsTitle = document.createElement('h3');
                        keywordsTitle.textContent = "Keywords";

                        keywordsElement.appendChild(keywordsTitle);

                        if (keywordsDiv) {
                            const anchors = keywordsDiv.querySelectorAll('a'); // Get all <a> tags inside keywordsDiv
                            for (let i = 0; i < anchors.length; i++) {
                                if (i === anchors.length - 1) {
                                    keywordsElement.appendChild(anchors[i].cloneNode(true)); // Clone to avoid moving
                                } else {
                                    keywordsElement.appendChild(anchors[i].cloneNode(true)); // Clone to avoid moving
                                    const comma = document.createElement('p');
                                    comma.textContent = ", ";
                                    keywordsElement.appendChild(comma);
                                }
                            }
                        }
                        main_div.appendChild(descriptionDiv);
                        main_div.appendChild(keywordsElement);
                        main_div.appendChild(dateElement);
                        main_container.appendChild(main_div);

                        const keywords = document.querySelectorAll('a');
                        for (let i = 0; i < keywords.length; i++) {
                            keywords[i].addEventListener('click', (e) => {
                                isContainerClicked = false;
                                backButton.classList.add('hide');
                                dropSearch.value = e.target.textContent;
                                search_nasa()
                            })
                        }
                    })

                    document.querySelector("#load_bar").classList.add("hide");
                }
                console.log(text);
            } catch (e) {
                console.error(e);
                const warning = document.querySelector('#warning');
                warning.textContent = "There is some trouble connecting to the server";
            }
    }
    // Handle search button click
    searchButton.addEventListener('click', search_nasa);
    
    const backButton = document.querySelector('#backButton');
    backButton.addEventListener('click',  function () {
        backButton.classList.add('hide');
        main_container.innerHTML = '';
        searchBar.classList.remove('hide');
        main_container.classList.add('text');
        dropSearch.classList.remove('hide');
        isContainerClicked = false;
        search_nasa()
    })
    
    document.querySelector('#back2top').addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
    });

    radom_search(dropSearch, searchButton);
});
