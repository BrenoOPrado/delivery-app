import React from 'react';
import { requestData } from '../helpers/instance';
import Button from './Button';

class ProductsCards extends React.Component {
  constructor() {
    super();
    this.state = {
      products: [],
      qtd: {},
      cart: [],
    };
  }

  componentDidMount() {
    this.fetchProducts('products');
  }

  fetchProducts = async (endpoint) => requestData(endpoint)
    .then((response) => this.setProducts(response))
    .catch((error) => console.log(error));

  setProducts = (products) => this.setState({ products });

  addQuantity = (id) => {
    const { qtd } = this.state;
    if (!qtd[id]) {
      this.setState((previousState) => (
        { qtd: { ...previousState.qtd, [id]: { quantity: 1 } } }
      ), () => this.onInputChange(id));
    } else {
      this.setState((previousState) => (
        { qtd:
           { ...previousState.qtd,
             [id]: { quantity: previousState.qtd[id].quantity + 1 },
           },
        }
      ), () => this.onInputChange(id));
    }
  };

  subQuantity = (id) => {
    const { qtd } = this.state;
    if (qtd[id] && qtd[id].quantity > 0) {
      this.setState((previousState) => (
        { qtd:
           { ...previousState.qtd,
             [id]: { quantity: previousState.qtd[id].quantity - 1 },
           },
        }
      ), () => this.onInputChange(id));
    }
  };

  onInputChange = (id) => {
    const { qtd: { [id]: { quantity } }, products } = this.state;
    const [product] = products.filter(({ id: pId }) => pId === id);
    const newCart = {
      ...product,
      quantity,
      totalPrice: (Number(product.price) * quantity).toFixed(2),
    };

    this.cartSetState(id, newCart);
  };

  handleManualInputChange = (id, e) => {
    this.setState((previousState) => (
      { qtd:
         { ...previousState.qtd,
           [id]: { quantity: +e.target.value },
         },
      }
    ), () => this.onInputChange(id));
  };

  cartSetState = (id, newCart) => this.setState((previousState) => {
    const prev = previousState.cart.filter(({ id: pId }) => pId !== id);

    return newCart.quantity === 0
      ? this.rmCartState(prev)
      : this.addCartState(prev, newCart);
  }, () => this.cartToLocalStorage());

  addCartState = (prev, curr) => ({ cart: [...prev, curr] });

  rmCartState = (prev) => ({ cart: [...prev] });

  totalPriceCart = () => {
    const { cart } = this.state;
    const total = cart.map(({ totalPrice }) => Number(totalPrice))
      .reduce((acc, curr) => acc + curr).toFixed(2);
    return total;
  };

  cartToLocalStorage = () => {
    const { cart } = this.state;
    return cart.length > 0
      ? localStorage.setItem('cart', JSON.stringify(cart))
      : localStorage.removeItem('cart');
  };

  total = () => this.totalPriceCart();

  handleRedirectToCheckout = () => {
    const { history } = this.props;
    history.push('/customers/checkout');
  };

  handleButtonDisable = () => {
    const { cart } = this.status;

    return cart.length === 0;
  };

  displayCart = () => {
    const total = this.total();
    const totalReplaced = total.replace('.', ',');
    return (
      <Button
        dataTestId="data-testid='customer_products__button-cart"
        onAction={ this.handleRedirectToCheckout }
        onCheckIsDisable={ this.handleButtonDisable }
        // className="display-cart-button"
      >
        {totalReplaced}
      </Button>
    );
  };

  render() {
    const { products, qtd } = this.state;

    return (
      <>
        <div className="cards">
          { products.map((product) => {
            const { id, name, price, urlImage } = product;
            const priceReplaced = price.replace('.', ',');
            return (
              <div key={ id } className="individual-cards">
                <p data-testid={ `customer_products__element-card-price-${id}` }>
                  { `R$ ${priceReplaced}` }
                </p>
                <img
                  src={ urlImage }
                  alt={ name }
                  data-testid={ `customer_products__img-card-bg-image-${id}` }
                  width="50px"
                />
                <p data-testid={ `customer_products__element-card-title-${id}` }>
                  { name }
                </p>
                <div>
                  <button
                    type="button"
                    id={ `add-${id}` }
                    onClick={ () => this.addQuantity(id) }
                    data-testid={ `customer_products__button-card-add-item-${id}` }
                  >
                    +
                  </button>
                  <input
                    type="number"
                    name="qtd"
                    className="inputQtd"
                    defaultValue={ 0 }
                    id={ `input-${id}` }
                    value={ qtd[id] && qtd[id].quantity }
                    data-testid={ `customer_products__input-card-quantity-${id}` }
                    onChange={ (e) => this.handleManualInputChange(id, e) }
                  />
                  <button
                    type="button"
                    id={ `rm-${id}` }
                    data-testid={ `customer_products__button-card-rm-item-${id}` }
                    onClick={ () => this.subQuantity(id) }
                  >
                    -
                  </button>
                </div>
              </div>
            );
          }) }
        </div>
        <div className="display-cart">
          { this.displayCart() }
        </div>
      </>
    );
  }
}

ProductsCards.propTypes = {
  history: PropTypes.shape(object.PropTypes).isRequired,
};

export default ProductsCards;
