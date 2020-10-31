import store from '.'
import { addProductToList, createList, deleteList, deleteProductInList, getOwnerLists, readList } from '@/api/list';
import { SelectedList, List } from '@/models/list'
import { Action, Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import { Product, ProductInSelectedList } from '@/models/product';
import { CategoryInSelectedList } from '@/models/category';
import { DEFAULT_CATEGORY_ID, DEFAULT_CATEGORY_NAME } from '@/utils/constants';

@Module({ dynamic: true, store, name: 'list' })
export class ListModule extends VuexModule {
  lists: List[] = []
  selectedList: SelectedList | null = null

  get all() {
    return this.lists
  }

  get one() {
    return (id: string) => this.lists.find(list => list.id === id)
  }

  get selected() {
    return this.selectedList
  }

  get productsInSelectedList() {
    const productsInList: ProductInSelectedList[] = []

    if (this.selectedList) {
      this.selectedList!.categories.forEach(category => productsInList.push(...category.products))
    }

    return productsInList
  }

  @Mutation
  add(list: List) {
    this.lists = [...this.lists, list];
  }

  @Mutation
  set(lists: List[]) {
    this.lists = lists
  }

  @Mutation
  setSelectedList(selectedList: SelectedList) {
    this.selectedList = selectedList
  }

  @Mutation
  delete(id: string) {
    this.lists = this.lists.filter(list => list.id !== id)
  }

  @Mutation
  reset() {
    this.lists = []
  }

  @Mutation
  addProduct(product: ProductInSelectedList) {
    const newCategories = [...this.selectedList!.categories]
    const categoryIndex = newCategories.findIndex(category => category.id === product.category?.id)

    if (categoryIndex === -1) {
      if (product.category) {
        const newCategory: CategoryInSelectedList = {
          ...product.category!,
          products: [product]
        }
        newCategories.unshift(newCategory)
      } else {
        const lastIndex = newCategories.length - 1
        if (newCategories.length && newCategories[lastIndex].id === DEFAULT_CATEGORY_ID) {
          newCategories[lastIndex].products.push(product)
        } else {
          const newDefaultCategory: CategoryInSelectedList = {
            id: DEFAULT_CATEGORY_ID,
            name: DEFAULT_CATEGORY_NAME,
            products: [product]
          }

          newCategories.push(newDefaultCategory)
        }
      }
    } else {
      newCategories[categoryIndex].products.push(product)
    }

    this.selectedList!.categories = newCategories
  }

  @Mutation
  deleteProduct(product: ProductInSelectedList) {
    const newCategories = [...this.selectedList!.categories]
    let category: CategoryInSelectedList | undefined

    if (!product.category) {
      category = newCategories.find(category => category.id === DEFAULT_CATEGORY_ID)
    } else {
      category = newCategories.find(category => category.id === product.category!.id)
    }

    if (!category) {
      return
    }

    const productIndex = category.products.findIndex(productInCategory => productInCategory.id === product.id)
    category.products.splice(productIndex, 1)

    this.selectedList!.categories = newCategories
  }

  @Action({ commit: 'add' })
  async create(name: string) {
    return createList(name)
  }

  @Action({ commit: 'set' })
  async getOwners() {
    return getOwnerLists()
  }

  @Action({ commit: 'delete' })
  async deleteAction(id: string) {
    await deleteList(id)
    return id
  }

  @Action({ commit: 'addProduct' })
  async addProductAction(product: Product) {
    await addProductToList(product.id, this.selectedList!.id)

    const productInSelectedList: ProductInSelectedList = {
      ...product,
      buyed: false,
    }

    return productInSelectedList
  }

  @Action({ commit: 'deleteProduct' })
  async deleteProductAction(product: ProductInSelectedList) {
    await deleteProductInList(product.id, this.selectedList!.id)
    return product
  }

  @MutationAction
  async selectList(id: string) {
    const selectedList = await readList(id)
    selectedList.categories = selectedList.categories || []
    return { selectedList }
  }
}
