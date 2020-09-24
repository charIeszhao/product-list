import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Product, ProductService } from './product.service';

type ProductListItem = {
  category: string;
  products: Array<Product>;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  queryStr = '';
  isShowInStock: boolean;
  showModal: boolean;
  showNoProductMessage: boolean;
  originalProductList: Array<ProductListItem> = [];
  productList: Array<ProductListItem>;
  selectedProduct: Product;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.productService.getProducts().then(data => {
      this.productList = _(data).groupBy('category').map((group, category) => ({category, products: group})).value();
      this.originalProductList = JSON.parse(JSON.stringify(this.productList));
    });
  }

  onSearch(): void {
    console.log(this.isShowInStock);
    const temp: Array<ProductListItem> = JSON.parse(JSON.stringify(this.originalProductList));
    const queryStr = this.queryStr.toLowerCase();
    let count = 0;
    temp.forEach(categoryGroup => {
      categoryGroup.products = categoryGroup.products.filter(
        product => product.name.toLowerCase().includes(queryStr) && (this.isShowInStock ? product.inStock : true)
      );
      count += categoryGroup.products.length;
    });
    this.productList = temp;
    this.showNoProductMessage = count === 0;
  }

  viewProductDetail(product: Product): void {
    this.showModal = true;
    this.selectedProduct = product;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
  }
}
