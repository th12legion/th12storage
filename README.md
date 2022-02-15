# th12storage

A small global state manager in React.

## How to use

```javascript
	import { useStorage } from "th12storage";

	function Test(){
		let [hello] = useStorage("hello", "Hello");
	}
```

To be able to change the value, you have to create a method to change it.

```javascript
	import { useStorage } from "th12storage";

	function Test(){
		let [hello, setHello] = useStorage("hello", "Hello", true);

		setHello("Hello, world!");
	}
```

But even with this change, the component will not respond to it. 
You need to create function trigger.

```javascript
	import { useState } from "react";
	import { useStorage } from "th12storage";

	function Test(){
		let [st, rst] = useState(0);
		let [hello, setHello] = useStorage("hello", "Hello", true);

		if(hello==="Hello"){
			setHello("Hello, world!", rst);
		}
	}
```

This method is not convenient if you use a lot of variables. In that case, you can use subscribes.

```javascript
	import { useState } from "react";
	import { useStorage, useStorageSubscribe } from "th12storage";

	function Test(){
		let [st, rst] = useState(0);
		useStorageSubscribe("Test", ["hello", "user"], rst);

		let [hello, setHello] = useStorage("hello", "Hello", true);
		let [user, setUser] = useStorage("user", "", true);

		if(user===""){
			setUser("John Doe");
		}else if(hello=="hello"){
			setHello("Hello, "+user+"!");
		}
	}
```

## Parameters

useStorage(VARIABLE NAME, DEFAULT VALUE [,CREATE UPDATE VARIABLE TRIGGER])

useStorageSubscribe(COMPONENT NAME, SUBSCRIBES LIST, COMPONENT UPDATE TRIGGER)