import { doFetch } from './api';
import { List } from '@/models/list';

export function createList(name: string): Promise<List> {
  return doFetch({
    url: 'lists',
    method: 'POST',
    data: { name }
  });
}

export function getOwnerLists(): Promise<Array<List>> {
  return doFetch({
    url: 'lists',
    method: 'GET',
  })
}
