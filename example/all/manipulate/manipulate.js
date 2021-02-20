define([
	'jquery',
	'./useItems',
	'./useChooser',
	'./useDialog',
	'./useModal',
	'./useTooltip',
	'./useMessage',
	'./useNotify',
	'./useLoading',
], function (
	$,
	useItems,
	useChooser,
	useDialog,
	useModal,
	useTooltip,
	useMessage,
	useNotify,
	useLoading
) {
	return function () {
		useItems();
		useChooser();
		useDialog();
		useModal();
		useTooltip();
		useMessage();
		useNotify();
		useLoading();
	}
});