let app = new Vue({
  el: "#app",
  data: {
    product: "Socks",
    brand: "Vue Mastery", // Добавляем brand
    image: "./assets/vmSocks-green-onWhite.jpg",
    altText: "A pair of socks",
    inStock: false, // Проверяем стили для "Out of Stock"
    onSale: true, // Логическое свойство о распродаже
    details: ["80% cotton", "20% polyester", "Gender-neutral"],
    cart: 0,
    variants: [
      {
        variantId: 2234,
        variantColor: "green",
        variantImage: "./assets/vmSocks-green-onWhite.jpg"
      },
      {
        variantId: 2235,
        variantColor: "blue",
        variantImage: "./assets/vmSocks-blue-onWhite.jpg"
      }
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  methods: {
    addToCart() {
      this.cart += 1;
    },
    removeFromCart() {
      if (this.cart > 0) {
        this.cart -= 1;
      }
    },
    updateProduct(index) {
      this.selectedVariant = index;
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    sale() {
      if (this.onSale) {
        return `Hurry! The ${this.brand} ${this.product} is on sale!`;
      } else {
        return `No sale at the moment for ${this.brand} ${this.product}.`;
      }
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity > 0;
    }
  }
});
