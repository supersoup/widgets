define(function () {
	return [
		{
			title: '四川省',
			id: '1',
			children: [
				{
					title: '成都市',
					id: '11',
					children: [
						{
							title: '金牛区',
							id: '111'
						}, {
							title: '武侯区',
							id: '112'
						}, {
							title: '青羊区',
							id: '113'
						}, {
							title: '锦江区',
							id: '114'
						}, {
							title: '成华区',
							id: '115'
						}, {
							title: '高新区',
							id: '116'
						}
					]
				}, {
					title: '达州市',
					id: '12',
					//如果初始设置为关闭，则添加该属性
					open: false,
					children: [
						{
							title: '渠县',
							id: '121'
						}, {
							title: '达县',
							id: '122'
						}, {
							title: '万源市',
							id: '123'
						}
					]
				}, {
					title: '泸州市',
					id: '13',
					children: [
						{
							title: '古蔺县',
							id: '131'
						}, {
							title: '合江县',
							id: '132'
						}
					]
				}, {
					title: '遂宁市',
					id: '14'
				}, {
					title: '南充市',
					id: '15'
				}, {
					title: '攀枝花市',
					id: '16'
				}
			]
		}, {
			title: '湖北省',
			id: '2'
		}, {
			title: '云南省',
			id: '3'
		}, {
			title: '贵州省',
			id: '4'
		}
	];
});