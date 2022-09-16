import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal } from 'solid-js';

import BookShelf from './BookShelf';

const App: Component = () => {
  const [count, setCount] = createSignal(10);

  console.log('create app component')
 
  return (
    <div class="container mx-auto px-4">
      <BookShelf name="My Book Shelf" />
    </div>
  );
};

export default App;
