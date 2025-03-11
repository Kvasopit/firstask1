Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      <div class="product-image">
        <img :src="image" :alt="altText"/>
      </div>
      <div class="product-info">
        <h1>{{ title }}</h1>
        <p v-if="inStock">In stock</p>
        <p v-else :class="{ 'out-of-stock': !inStock }">Out of Stock</p>

        <product-details :details="details"></product-details>

        <div class="color-boxes">
          <div
            class="color-box"
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            :style="{ backgroundColor: variant.variantColor }"
            @mouseover="updateProduct(index)"
          ></div>
        </div>

        <h3>Available sizes:</h3>
        <ul>
          <li v-for="size in sizes">{{ size }}</li>
        </ul>

        <p>Shipping: {{ shipping }}</p>
      </div>

      <div class="cart">
        <button
          v-on:click="addToCart"
          :disabled="!inStock"
          :class="{ disabledButton: !inStock }"
        >
          Add to cart
        </button>
        <button
          v-on:click="removeFromCart"
          :disabled="!inCart"
          :class="{ disabledButton: !inCart }"
        >
          Remove from cart
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      product: "Socks",
      brand: "Vue Mastery",
      selectedVariant: 0,
      altText: "A pair of socks",
      onSale: true,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green-onWhite.jpg",
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue-onWhite.jpg",
        }
      ],
      sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
    };
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return true; // Убираем глобальный запас, т.к. корзина управляется в корневом Vue
    },
    shipping() {
      return this.premium ? "Free" : "2.99";
    },
    inCart() {
      return this.$root.cart.includes(this.variants[this.selectedVariant].variantId);
    }
  }
});

let app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeFromCart(id) {
      let index = this.cart.indexOf(id);
      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    }
  }
});
