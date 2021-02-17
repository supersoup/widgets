define(function () {
	return [
		{
			title: '四川省', id: '1', people: '8375', gdp: '46615', area: '486000',
			children: [
				{
					title: '成都市', id: '11', people: '1658', gdp: '17716', area: '14335',
					children: [
						{
							title: '金牛区', id: '111', people: '122', gdp: '1289', area: '108',
						}, {
							title: '武侯区', id: '112', people: '109', gdp: '1201', area: '76',
						}, {
							title: '青羊区', id: '113', people: '85', gdp: '1283', area: '67',
						}, {
							title: '锦江区', id: '114', people: '71', gdp: '1122', area: '61',
						}, {
							title: '成华区', id: '115', people: '96', gdp: '1103', area: '110',
						}, {
							title: '高新区', id: '116', people: '90', gdp: '2285', area: '130',
						}
					]
				}, {
					title: '达州市', id: '12', people: '658', gdp: '2118', area: '16591',
					//如果初始设置为关闭，则添加该属性
					open: false,
					children: [
						{
							title: '渠县', id: '150', people: '122', gdp: '347', area: '2018',
						}, {
							title: '达县', id: '122', people: '110', gdp: '363', area: '2245',
						}, {
							title: '万源市', id: '123', people: '57', gdp: '134', area: '4065',
						}
					]
				}, {
					title: '泸州市', id: '13', people: '508', gdp: '2157', area: '12232',
					children: [
						{
							title: '古蔺县', id: '131', people: '87', gdp: '172', area: '3184',
						}, {
							title: '合江县', id: '132', people: '90', gdp: '189', area: '2414',
						}
					]
				}, {
					title: '遂宁市', id: '14', people: '362', gdp: '1403', area: '5322',
				}, {
					title: '南充市', id: '15', people: '723', gdp: '2401', area: '12500',
				}, {
					title: '攀枝花市', id: '16', people: '121', gdp: '1040', area: '7414',
				}
			]
		}, {
			title: '湖北省', id: '2', people: '5927', gdp: '43443', area: '185900',
		}, {
			title: '云南省', id: '3', people: '4858', gdp: '23223', area: '394100',
		}, {
			title: '贵州省', id: '4', people: '3622', gdp: '17826', area: '176167',
		}
	];
});