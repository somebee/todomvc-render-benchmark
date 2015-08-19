# Benchmarking raw rendering performance of TodoMVC implementations.

The benchmark can be run [here](http://somebee.github.io/todomvc-render-benchmark/index.html)

## Why
There has been a TodoMVC benchmark floating around earlier. It mainly tested the performance of your browser, by creating fake events and navigating the dom to insert, complete, and remove todos. Some frameworks such as elm and mithril outperformed React by a lot. The (only) reason for this was that they used asynchronous rendering, while React rendered / synchronized the whole view every time a todo was inserted, completed, and removed. Making rendering in React asynchronous would take 2 lines of code, and bring its performance up to the others. A better benchmark is needed.

## Goal
The goal of this benchmark is to test the performance of pure rendering / [dom reconciliation](https://facebook.github.io/react/docs/reconciliation.html). It inserts, renames, toggles, moves, and removes todos through an API that must be custom made for each TodoMVC implementation. These actions should happen as low-level as possible, and should *not* trigger any sort of rendering. API.render() however should trigger a full forced rendering / reconciliation.

## Results
As you can see, Imba is *much* faster than the other implementations. So much faster in fact, that your first reaction is likely along the line "this seems fishy". Well, it really is that fast. It uses a very different approach from existing virtual dom implementations, by inlining and reusing actual dom nodes on subsequent renders. This is only practical to do in a compiled language (such as [Imba](http://imba.io)) - as the compiler can analyze the views, and do inline caching that would be very chaotic and cumbersome in plain js.

Imba enables a new way of writing web apps. Fully syncing the view is now so inexpensive that it is, for the first time, viable to simply render on every single frame, without any need for listeners, bindings, dependency tracking etc. Keeping the view 'in sync' is no longer an issue. It is like rendering templates on the server - where you always know the whole state/story on render. If you for some reason want to keep tracking and only rerendering subviews etc this is as easy as it ever was with React.

Even though it looks incredibly boring, the "Unchanged Render" is possibly the most interesting benchmark. All of these frameworks are plenty fast if they only render whenever something has changed. But if the frameworks are fast enough to render the whole app in 0.01ms, you could skip thinking about all sorts of tracking to keep the view in sync.

## Spec
A spec for the API is underway, but until then you can look at the default [api.js](https://github.com/somebee/todomvc-render-benchmark/blob/master/resources/api.js).

## Contribute
I am sure that the different implementations can be tweaked for better performance, and I'm happy to apply such improvements if you send a pull request. The improvements should however, adhere to the philosophy of the framework and maintain readability.

## PS
Neither Imba nor React are using their respective shouldComponentUpdate in this benchmark, as this would not be fair to Mithril. Again, this is intended to really compare the speeds of a full synchronous rendering of the whole app. The relative performance difference between Imba and React is not affected by this. When optimizations are active, both are slightly faster.

Some framework are not made for this at all, and it does not make sense to include them in this benchmark. This is meant to test the performance of bringing the whole view in sync with the models, like if you have no bindings or anything. Angular is included in the repo, but disabled for now.It does tons of stuff under the hood, and it is difficult for me to know what would be like a _full_ rerendering in Angular. It might not even be relevant.