import { doFetch, FetchOptions } from './api';
import { createList, getUsersLists, deleteList, addProductToList, readList, deleteProductInList, archiveList, setBuyedProductInList } from './list';
import { List } from '@/models/list';
import { when } from 'jest-when';

jest.mock('./api');

describe('List API', () => {
  const name = 'shopping';
  const listID = 'list id';
  const productID = 'product ID'
  const creationDate = 'creation-date'
  const list: List = {
    id: listID,
    name,
    creationDate
  };
  const lists: List[] = [list];
  const buyed = true

  const expectedCreateOptions: FetchOptions = {
    url: 'lists',
    method: 'POST',
    data: {
      name
    }
  };

  const expectedGetOptions: FetchOptions = {
    url: 'lists',
    method: 'GET'
  };

  const expectedDeleteListOptions: FetchOptions = {
    url: `lists/${listID}`,
    method: 'DELETE',
  }

  const expectedDeleteProductFromListOptions: FetchOptions = {
    url: `lists/${listID}/products/${productID}`,
    method: 'DELETE',
  }

  const expectedAddProductToListOptions: FetchOptions = {
    url: `lists/${listID}/products/${productID}`,
    method: 'POST'
  }

  const expectedSetBuyedProductOptions: FetchOptions = {
    url: `lists/${listID}/products/${productID}`,
    method: 'PATCH',
    data: {
      buyed
    }
  }

  const expectedReadListOptions: FetchOptions = {
    url: `lists/${listID}`,
    method: 'GET'
  }

  const expectedArchiveListOptions: FetchOptions = {
    url: `lists/${listID}/archive`,
    method: 'POST'
  }

  beforeEach(() => {
    (doFetch as jest.Mock).mockClear();
    when(doFetch as jest.Mock).calledWith(expectedCreateOptions).mockResolvedValue(list);
    when(doFetch as jest.Mock).calledWith(expectedGetOptions).mockResolvedValue([list]);
    when(doFetch as jest.Mock).calledWith(expectedDeleteListOptions).mockResolvedValue({});
    when(doFetch as jest.Mock).calledWith(expectedAddProductToListOptions).mockResolvedValue({})
    when(doFetch as jest.Mock).calledWith(expectedReadListOptions).mockResolvedValue(list)
    when(doFetch as jest.Mock).calledWith(expectedDeleteProductFromListOptions).mockResolvedValue({})
    when(doFetch as jest.Mock).calledWith(expectedArchiveListOptions).mockResolvedValue(list)
    when(doFetch as jest.Mock).calledWith(expectedSetBuyedProductOptions).mockResolvedValue({})
  });

  describe('createList', () => {
    it('Should call create list endpoint with right parameters.', done => {
      createList(name).then(() => {
        expect(doFetch).toHaveBeenCalledWith(expectedCreateOptions);
        done();
      });
    });

    it('Should return list from the endpoint.', done => {
      createList(name).then(res => {
        expect(res).toEqual(list)
        done();
      });
    });
  });

  describe('getUsersLists', () => {
    it('Should call get lists endpoint with right parameters.', done => {
      getUsersLists().then(() => {
        expect(doFetch).toHaveBeenCalledWith(expectedGetOptions);
        done();
      });
    });

    it('Should return lists from the endpoint.', done => {
      getUsersLists().then(res => {
        expect(res).toEqual(lists);
        done();
      });
    });
  });

  describe('deleteList', () => {
    it('Should call delete list endpoint with right parameters.', done => {
      deleteList(listID).then(() => {
        expect(doFetch).toHaveBeenCalledWith(expectedDeleteListOptions);
        done();
      });
    });
  });

  describe('addProductToList', () => {
    it('Should call add product to list with the right parameters', done => {
      addProductToList(productID, listID).then(() => {
        expect(doFetch).toHaveBeenCalledWith(expectedAddProductToListOptions)
        done()
      })
    })
  })

  describe('deleteProductInList', () => {
    it('Should call delete product from list endpoint with right parameters.', done => {
      deleteProductInList(productID, listID).then(() => {
        expect(doFetch).toHaveBeenCalledWith(expectedDeleteProductFromListOptions)
        done()
      })
    })
  })

  describe('setBuyedProductInList', () => {
    it('Should call set buyed product in list with the right parameters', done => {
      setBuyedProductInList(productID, listID, buyed).then(() => {
        expect(doFetch).toHaveBeenCalledWith(expectedSetBuyedProductOptions)
        done()
      })
    })
  })

  describe('readList', () => {
    it('Should call add product to list with the right parameters', done => {
      readList(listID).then(resultList => {
        expect(doFetch).toHaveBeenCalledWith(expectedReadListOptions)
        expect(resultList).toEqual(list)
        done()
      })
    })
  })

  describe('archiveList', () => {
    it('Should call archive list endpoint with the right parameters', done => {
      archiveList(listID).then(resultList => {
        expect(doFetch).toHaveBeenCalledWith(expectedArchiveListOptions)
        expect(resultList).toEqual(list)
        done()
      })
    })
  })
})
