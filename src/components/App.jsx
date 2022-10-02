import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { getImages } from 'api/api-images';
import { Searchbar } from './Searchbar';
import { Loader } from 'components/Loader';
import { ImageGallery } from 'components/ImageGallery';
import { Button } from './Button';
import Modal from './Modal/Modal';
import styles from './App.module.css';

export class App extends Component {
  state = {
    images: [],
    searchImages: '',
    page: 1,
    loading: false,
    error: null,
    openModal: false,
    contentModal: {
      tags: '',
      largeImageURL: '',
    },
    total: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchImages !== this.state.searchImages) {
      this.fetchImage();
    }
  }

  fetchImage = async () => {
    const { page, searchImages } = this.state;

    this.setState({ loading: true });

    try {
      const data = await getImages(searchImages, page);

      this.setState(prevState => {
        return {
          images: [...prevState.images, ...data.hits],
          page: prevState.page + 1,
          total: data.total,
        };
      }, this.scrollOnLoadButton);

      if (page === 1 && data.total > 0) {
        toast.success(`We found ${data.total} images`);
      }
    } catch (error) {
      this.setState({
        error,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  onSearchSubmit = searchImages => {
    this.setState({ searchImages, page: 1, images: [], error: null });
  };

  onCloseModal = () => {
    this.setState({
      openModal: false,
      contentModal: {
        tags: '',
        largeImageURL: '',
      },
    });
  };

  onOpenModal = contentModal => {
    this.setState({
      openModal: true,
      contentModal,
    });
  };

  scrollOnLoadButton = () => {
    window.scrollTo({
      top: document.body.clientHeight - 1000,
      behavior: 'smooth',
    });
  };

  render() {
    const { loading, error, openModal, images, contentModal, total } =
      this.state;

    const showLoadMoreBtn = images.length !== total;

    return (
      <div className={styles.app}>
        <Searchbar onSearchSubmit={this.onSearchSubmit} />

        {loading && <Loader />}

        {error && <p className={styles.appText}>Please try again later</p>}

        {images.length < 1 && !loading &&
          !error && (
          <div className={styles.appText}>There's nothing here :(</div>
        )}

        <ImageGallery images={images} onClick={this.onOpenModal} />

        {showLoadMoreBtn && !loading && <Button onClick={this.fetchImage} />}

        <ToastContainer autoClose={3000} />

        {openModal && (
          <Modal onClose={this.onCloseModal}>
            <img
              className={styles.appModal}
              src={contentModal.largeImageURL}
              alt={contentModal.tags}
            />
          </Modal>
        )}
      </div>
    );
  }
}
