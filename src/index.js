import './js/image-service';
import ImageApiService from './js/image-service';
import imageCardTpl from './temblates/image-card.hbs';
import Notiflix from "notiflix";
import './js/lightbox';
const imageApiService = new ImageApiService()


const refs = {
    searchForm: document.querySelector('.search-form'),
    imageContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
};


refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);


async function onSearch(e) {
    e.preventDefault();
    imageApiService.resetPage();
    clearImgContainer();
    refs.loadMoreBtn.classList.add('hidden')
    imageApiService.searchQuery = e.currentTarget.elements.searchQuery.value;

    if (imageApiService.searchQuery === '') {
        return;
    };
   

    try {
        const res = await imageApiService.fetchImages()
    

        appendImageMarkup(res.hits);

       Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
    
        if (res.hits.length === 0) {
        refs.loadMoreBtn.classList.add('hidden')
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        };
        
        refs.loadMoreBtn.classList.remove('hidden');
     
        

    } catch (error) {
        console.log(error);
    }
};

async function onLoadMore() {
    
    try {
        const res = await imageApiService.fetchImages();
        // appendImageMarkup(res.hits);
        // getTotalImgCount(res);
        // gallery.refresh();
     
        if (refs.imageContainer.querySelectorAll('.photo-card').length === res.totalHits) {
            getTotalImgCount()
        } else {

            appendImageMarkup(res.hits);
        }
      
    } catch (error) {
        console.log(error);
    }
}



function appendImageMarkup(data) {
    refs.imageContainer.insertAdjacentHTML('beforeend', imageCardTpl(data))
};

function clearImgContainer() {
    refs.imageContainer.innerHTML = '';
};

function getTotalImgCount() {
    
  refs.loadMoreBtn.style.display = 'none'
     
Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    
};
