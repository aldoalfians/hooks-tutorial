import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case "SET":
			return action.ingredients;
		case "ADD":
			return [...currentIngredients, action.ingredient];
		case "DELETE":
			return currentIngredients.filter((ing) => ing.id !== action.id);
		default:
			throw new Error("Should not get there!");
	}
};

// di comment karen using custom hooks
// const httpReducer = (curHttpState, action) => {
// 	switch (action.type) {
// 		case "SEND":
// 			return { loading: true, error: null };
// 		case "RESPONSE":
// 			return { ...curHttpState, loading: false };
// 		case "ERROR":
// 			return { loading: false, error: action.errorMessage };
// 		case "CLEAR":
// 			return { ...curHttpState, error: null };
// 		default:
// 			throw new Error("Should not get there!");
// 	}
// };

const Ingredients = () => {
	// reducer dicall
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
	// using custom hooks
	const {
		isLoading,
		error,
		data,
		sendRequest,
		reqExtra,
		reqIdentifier,
		clear,
	} = useHttp();
	// noted nama dispatch tidak boleh sama
	// ini dicomment using custom hooks
	// const [httpState, dispatchHttp] = useReducer(httpReducer, {
	// 	loading: false,
	// 	error: null,
	// });
	// sudah tidak digunakan karena use redux
	// const [userIngredients, setUserIngredients] = useState([]);
	//
	// const [isLoading, setIsLoading] = useState(false);
	// const [error, setError] = useState();

	useEffect(() => {
		if (!isLoading && !error && reqIdentifier === "REMOVE_INGREDIENT") {
			dispatch({
				type: "DELETE",
				id: reqExtra,
			});
		} else if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENT") {
			dispatch({
				type: "ADD",
				ingredient: {
					id: data.name,
					...reqExtra,
				},
			});
		}
	}, [data, reqExtra, reqIdentifier, isLoading, error]);

	const filterIngredientsHandler = useCallback((filterIngredients) => {
		// tidak digunakan karena redux
		// setUserIngredients(filterIngredients);
		dispatch({
			type: "SET",
			ingredients: filterIngredients,
		});
	}, []);

	const addIngredientHandler = useCallback(
		(ingredient) => {
			// using custom hooks
			sendRequest(
				`https://lern-react-hooks-default-rtdb.firebaseio.com/ingredients.json`,
				"POST",
				JSON.stringify(ingredient),
				ingredient,
				"ADD_INGREDIENT"
			);
			// sudah tidak digunakan karena use redux
			// setIsLoading(true)
			// dispatchHttp({ type: "SEND" });
			// fetch(
			// 	"https://lern-react-hooks-default-rtdb.firebaseio.com/ingredients.json",
			// 	{
			// 		method: "POST",
			// 		body: JSON.stringify(ingredient),
			// 		headers: { "Content-Type": "application/json" },
			// 	}
			// )
			// .then((response) => {
			// tidak digunakan karena redux
			// setIsLoading(false);
			// 	dispatchHttp({ type: "RESPONSE" });
			// 	return response.json();
			// })
			// .then((responseData) => {
			// tidak digunakan karena redux
			// setUserIngredients((prevIngredients) => [
			// 	...prevIngredients,
			// 	{ id: responseData.name, ...ingredient },
			// ]);
			// 	dispatch({
			// 		type: "ADD",
			// 		ingredient: { id: responseData.name, ...ingredient },
			// 	});
			// });
		},
		[sendRequest]
	);

	const removeIngredientHandler = useCallback(
		(ingredientId) => {
			// using custom hooks
			sendRequest(
				`https://lern-react-hooks-default-rtdb.firebaseio.com/ingredients/${ingredientId}.jsn`,
				"DELETE",
				null,
				ingredientId,
				"REMOVE_INGREDIENT"
			);
			// tidak digunakan karena redux
			// setIsLoading(true);
			// di comment using custom hooks
			// dispatchHttp({ type: "SEND" });
			// dicomment karena using react custom
			// fetch(
			// 	`https://lern-react-hooks-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
			// 	{
			// 		method: "DELETE",
			// 	}
			// )
			// .then((response) => {
			// sudah tidak digunakan karena redux
			// setIsLoading(false);
			// dispatchHttp({ type: "RESPONSE" });
			// sudah tidak digunakan karena redux
			// setUserIngredients((prevIngredients) =>
			// 	prevIngredients.filter(
			// 		(ingredient) => ingredient.id !== ingredientId
			// 	)
			// );
			// dispatch({
			// 	type: "DELETE",
			// 	id: ingredientId,
			// });
			// })
			// .catch((error) => {
			// sudah tidak digunakan karena redux
			// setError("Something went wrong");
			// dispatchHttp({
			// 	type: "ERROR",
			// 	errorMessage: "Something went wrong",
			// });
			// });
		},
		[sendRequest]
	);

	// const clearError = useCallback(() => {
	// 	// using custom hooks
	// 	// clear()
	// 	// tidak digunakan karena redux
	// 	// setError(null);
	// 	// dispatchHttp({ type: "CLEAR" });
	// }, []);

	const ingredientsList = useMemo(() => {
		return (
			<IngredientList
				ingredients={userIngredients}
				onRemoveItem={removeIngredientHandler}
			/>
		);
	}, [userIngredients, removeIngredientHandler]);

	return (
		<div className="App">
			{error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={isLoading}
			/>

			<section>
				<Search onLoadIngredients={filterIngredientsHandler} />
				{ingredientsList}
			</section>
		</div>
	);
};

export default Ingredients;
