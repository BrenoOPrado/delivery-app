import React from 'react';
import PropTypes from 'prop-types';

class TotalPriceInfo extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <article className="total-price-info">
        <p>
          R$
          {' '}
          { children }
        </p>
      </article>
    );
  }
}

TotalPriceInfo.propTypes = {
  children: PropTypes.number.isRequired,
};

export default TotalPriceInfo;
