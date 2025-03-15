let eventBus = new Vue();

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
        <product-tabs></product-tabs>

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
      sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
      reviews: []
    };
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    });
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
      return true;
    },
    shipping() {
      return this.premium ? "Free" : "2.99";
    },
    inCart() {
      return this.$root.cart.includes(this.variants[this.selectedVariant].variantId);
    }
  }
});

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <!-- Поле Name -->
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="Your name">
        <span class="error" v-if="errors.name">{{ errors.name }}</span>
      </p>

      <!-- Поле Review -->
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review" placeholder="Write a review here"></textarea>
        <span class="error" v-if="errors.review">{{ errors.review }}</span>
      </p>

      <!-- Поле Rating -->
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model="rating">
          <option value="" disabled selected>Select rating</option>
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select> 
        <span class="error" v-if="errors.rating">{{ errors.rating }}</span>
      </p>

      <!-- Поле Recommendation -->
      <p>Would you recommend this product?</p>
      <div class="recommendation-block">
        <label>
          <input type="radio" v-model="recommend" value="yes"> Yes
        </label>
        <label>
          <input type="radio" v-model="recommend" value="no"> No
        </label>
      </div>
      <span class="error" v-if="errors.recommend">{{ errors.recommend }}</span>

      <!-- Кнопка Submit -->
      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: "",
      review: "",
      rating: null,
      recommend: null,
      errors: {} // Объект для хранения ошибок
    };
  },
  methods: {
    onSubmit() {
      // Очищаем старые ошибки
      this.errors = {};

      // Проверка полей
      if (!this.name || this.name.trim() === "") {
        this.errors.name = "Name is required.";
      }
      if (!this.review || this.review.trim() === "") {
        this.errors.review = "Review is required.";
      }
      if (this.rating === null) {
        this.errors.rating = "Rating is required.";
      }
      if (this.recommend === null) {
        this.errors.recommend = "Recommendation is required.";
      }

      // Если ошибок нет, отправляем данные
      if (Object.keys(this.errors).length === 0) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: Number(this.rating),
          recommend: this.recommend
        };
        eventBus.$emit('review-submitted', productReview);

        // Очищаем поля после отправки
        this.name = "";
        this.review = "";
        this.rating = null;
        this.recommend = null;
      }
    }
  }
});

Vue.component('product-tabs', {
  props: {
    shipping: String,
    details: Array
  },
  template: `
    <div>
      <ul>
        <span class="tab"
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              :key="index"
              @click="selectedTab = tab"
        >{{ tab }}</span>
      </ul>

      <div v-show="selectedTab === 'Shipping'">
        <p>Shipping cost: {{ shipping }}</p>
      </div>

      <div v-show="selectedTab === 'Details'">
        <ul>
          <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
        </ul>
      </div>

      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="(review, index) in reviews" :key="index">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
            <p>Recommended: {{ review.recommend }}</p>
          </li>
        </ul>
      </div>

      <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
      </div>
    </div>
  `,
  data() {
    return {
      tabs: ['Shipping', 'Details', 'Reviews', 'Make a Review'],
      selectedTab: 'Shipping',
      reviews: []
    };
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    });
  }
});


let app = new Vue({
  el: '#app',
  data: {
    premium: false ,
    cart: [],
    tabs: ['Shipping', 'Details', 'Reviews', 'Make a Review']
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
