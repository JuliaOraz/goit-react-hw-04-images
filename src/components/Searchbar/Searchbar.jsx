import { Component } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import styles from './searchbar.module.css';

export class Searchbar extends Component {
  state = {
    searchImages: '',
    page: 1,
  };

  onChangeSearchForm = ({ currentTarget }) => {
    const { value } = currentTarget;
    this.setState({ searchImages: value.toLowerCase() });
  };

  onSubmitSearchForm = e => {
    e.preventDefault();

    const { searchImages } = this.state;

    if (searchImages.trim() === '') {
      toast.error('Search field is empty');
      return;
    }

    this.props.onSearchSubmit(searchImages);

    this.setState({
      searchImages: '',
      page: 1,
    });
  };

  render() {
    const { searchImages } = this.state;

    return (
      <>
        <header className={styles.searchBar}>
          <form
            className={styles.searchForm}
            onSubmit={this.onSubmitSearchForm}
          >
            <button type="submit" className={styles.searchFormButton}>
              <span
                className={styles.searchFormLabel}
                aria-label="search"
              ></span>
            </button>

            <input
              onChange={this.onChangeSearchForm}
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
  }
}

Searchbar.propTypes = {
  onSubmitSearchForm: PropTypes.func,
  'aria-label': PropTypes.string,
};
