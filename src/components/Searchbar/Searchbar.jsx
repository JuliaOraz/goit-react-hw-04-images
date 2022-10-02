import { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import styles from './searchbar.module.css';

export const Searchbar = ({ onSearchSubmit }) => {
  const [searchImages, setSearchImages] = useState('');

  const onChangeSearchForm = ({ currentTarget }) => {
    const { value } = currentTarget;
    setSearchImages(value.toLowerCase());
  };

  const onSubmitSearchForm = e => {
    e.preventDefault();

    if (searchImages.trim() === '') {
      toast.error('Search field is empty');
      return;
    }

    onSearchSubmit(searchImages);
    setSearchImages('');
  };

  return (
    <>
      <header className={styles.searchBar}>
        <form className={styles.searchForm} onSubmit={onSubmitSearchForm}>
          <button type="submit" className={styles.searchFormButton}>
            <span className={styles.searchFormLabel} aria-label="search"></span>
          </button>
          <input
            onChange={onChangeSearchForm}
            className={styles.searchFormInput}
            type="text"
            value={searchImages}
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </form>
      </header>
    </>
  );
};

Searchbar.propTypes = {
  onSubmitSearchForm: PropTypes.func,
  'aria-label': PropTypes.string,
};
