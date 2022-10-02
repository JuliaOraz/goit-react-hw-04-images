import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { animateScroll as scroll } from 'react-scroll';
import { getImages } from 'api/api-images';
import { Searchbar } from './Searchbar';
import { Loader } from 'components/Loader';
import { ImageGallery } from 'components/ImageGallery';
import { Button } from './Button';
import { Modal } from './Modal/Modal';
import styles from './App.module.css';

const initialModal = {
  tags: '',
  largeImageURL: '',
};

export const App = () => {
  const [images, setImages] = useState([]);
  const [searchImages, setSearchImages] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [contentModal, setContentModal] = useState(initialModal);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!searchImages) {
      return;
    }

    const fetchImage = async () => {
      setLoading(true);

      try {
        const data = await getImages(searchImages, page);
        setImages(prevImages => [...prevImages, ...data.hits]);

        setTotal(data.total);

        if (page === 1 && data.total > 0) {
          toast.success(`We found ${data.total} images`);
        }

        if (page !== 1) {
          scroll.scrollMore(330, { smooth: true });
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [searchImages, page]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onSearchSubmit = searchImages => {
    setSearchImages(searchImages);
    setImages([]);
    setPage(1);
    setError(null);
  };

  const onCloseModal = () => {
    setOpenModal(false);
    setContentModal(initialModal);
  };

  const onOpenModal = contentModal => {
    setOpenModal(true);
    setContentModal(contentModal);
  };

  const showLoadMoreBtn = images.length !== total;

  return (
    <div className={styles.app}>
      <Searchbar onSearchSubmit={onSearchSubmit} />
      {loading && <Loader />}
      {error && <p className={styles.appText}>Please try again later</p>}
      {images.length < 1 && !loading && !error && (
        <div className={styles.appText}>There's nothing here :(</div>
      )}
      <ImageGallery images={images} onClick={onOpenModal} />
      {showLoadMoreBtn && !loading && <Button onClick={loadMore} />}
      <ToastContainer autoClose={3000} />
      {openModal && (
        <Modal onClose={onCloseModal}>
          <img
            className={styles.appModal}
            src={contentModal.largeImageURL}
            alt={contentModal.tags}
          />
        </Modal>
      )}
    </div>
  );
};
