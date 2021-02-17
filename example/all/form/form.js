define([
	'./useNumber',
	'./useSearch',
	'./useTreeChoose',
	'./useDatePicker',
	'./useSlider',
	'./useCheckboxes',
	'./useTransfer',
], function (
	useNumber,
	useSearch,
	useTreeChoose,
	useDatePicker,
	useSlider,
	useCheckboxes,
	useTransfer,
) {
	return function () {
		useNumber();
		useSearch();
		useTreeChoose();
		useDatePicker();
		useSlider();
		useCheckboxes();
		useTransfer();
	}
});