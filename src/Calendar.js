'use strict';

import React    from 'react';
import {
	ListView,
	StyleSheet,
	Text,
}               from 'react-native';
import PropTypes from 'prop-types';

import Month    from './Month';
import { testID } from '../../../src/common/testID';

const StyleSheetPropType = PropTypes.oneOfType([
	PropTypes.object,
	PropTypes.number,
	PropTypes.array
]);

export default class Calendar extends React.Component {
	static defaultProps = {
		startDate: new Date(),
		monthsCount: 24,
		onSelectionChange: () => {
		},
		onSelectedDatesChange: () => {
		},

		monthsLocale: ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'],
		weekDaysLocale: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

		width: 280,

		bodyBackColor: 'white',
		bodyTextColor: 'black',
		headerSepColor: 'grey',

		monthTextColor: 'black',

		dayCommonBackColor: 'white',
		dayCommonTextColor: 'black',

		dayDisabledBackColor: 'white',
		dayDisabledTextColor: 'grey',

		daySelectedBackColor: '#4169e1',
		daySelectedTextColor: 'white',

		dayInRangeBackColor: '#87cefa',
		dayInRangeTextColor: 'black',

		TextComponent: Text,

		isFutureDate: false,
		rangeSelect: true,
		allowDaySelect: false
	};

	static propTypes = {
		selectFrom: PropTypes.instanceOf(Date),
		selectTo: PropTypes.instanceOf(Date),

		monthsCount: PropTypes.number,
		startDate: PropTypes.instanceOf(Date),

		monthsLocale: PropTypes.arrayOf(PropTypes.string),
		weekDaysLocale: PropTypes.arrayOf(PropTypes.string),
		startFromMonday: PropTypes.bool,

		onSelectionChange: PropTypes.func,
		onSelectedDatesChange: PropTypes.func,

		width: PropTypes.number,

		bodyBackColor: PropTypes.string,
		bodyTextColor: PropTypes.string,
		headerSepColor: PropTypes.string,

		monthTextColor: PropTypes.string,

		dayCommonBackColor: PropTypes.string,
		dayCommonTextColor: PropTypes.string,
		dayCommonStyle: StyleSheetPropType,

		dayDisabledBackColor: PropTypes.string,
		dayDisabledTextColor: PropTypes.string,
		dayDisabledStyle: StyleSheetPropType,

		daySelectedBackColor: PropTypes.string,
		daySelectedTextColor: PropTypes.string,
		daySelectedFromStyle: StyleSheetPropType,
		daySelectedToStyle: StyleSheetPropType,
		daySelectedSingleStyle: StyleSheetPropType,

		dayInRangeBackColor: PropTypes.string,
		dayInRangeTextColor: PropTypes.string,
		dayInRangeStyle: StyleSheetPropType,

		isFutureDate: PropTypes.bool,
		rangeSelect: PropTypes.bool,
		allowDaySelect: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.listViewRef = null;

		this.changeSelection = this.changeSelection.bind(this);
		this.generateMonths = this.generateMonths.bind(this);

		let {selectFrom, selectTo, monthsCount, startDate} = this.props;

		this.selectFrom = selectFrom;
		this.selectTo = selectTo;
		this.months = this.generateMonths(monthsCount, startDate);

		var dataSource = new ListView.DataSource({rowHasChanged: this.rowHasChanged});

		this.state = {
			dataSource: dataSource.cloneWithRows(this.months)
		}
	}

	scrollTo(params) {
		if (this.listViewRef != null) {
			this.listViewRef.scrollTo(params);
		}
	}

	rowHasChanged(r1, r2) {
		for (var i = 0; i < r1.length; i++) {
			if (r1[i].status !== r2[i].status && !r1[i].disabled) {
				return true;
			}
		}
	}

	generateMonths(count, startDate) {
		var months = [];
		var dateUTC;
		var monthIterator = startDate;
		var {isFutureDate, startFromMonday} = this.props;

		var startUTC = Date.UTC(startDate.getYear(), startDate.getMonth(), startDate.getDate());

		for (var i = 0; i < count; i++) {
			var month = this.getDates(monthIterator, startFromMonday);

			months.push(month.map((day) => {
				dateUTC = Date.UTC(day.getYear(), day.getMonth(), day.getDate());
				return {
					date: day,
					status: this.getStatus(day, this.selectFrom, this.selectTo),
					disabled: day.getMonth() !== monthIterator.getMonth()
					|| ((isFutureDate) ? startUTC > dateUTC : startUTC < dateUTC)
				}
			}));

			if (isFutureDate) {
				monthIterator.setMonth(monthIterator.getMonth() + 1);
			} else {
				monthIterator.setMonth(monthIterator.getMonth() - 1);
			}
		}

		return months;
	}

	getDates(month, startFromMonday) {
		month = new Date(month);
		month.setDate(1);

		var delta = month.getDay();
		if (startFromMonday) {
			delta--;
			if (delta === -1) delta = 6;
		}

		var startDate = new Date(month);
		startDate.setDate(startDate.getDate() - delta);

		month.setMonth(month.getMonth() + 1);
		month.setDate(0);

		delta = 6 - month.getDay();
		if (startFromMonday) {
			delta++;
			if (delta === 7) delta = 0;
		}

		var lastDate = new Date(month);
		lastDate.setDate(lastDate.getDate() + delta);

		var allDates = [];
		while (startDate <= lastDate) {
			allDates.push(new Date(startDate));
			startDate.setDate(startDate.getDate() + 1);
		}
		return allDates;
	}

	changeSelection(value) {
		var {selectFrom, selectTo, months} = this;

		if (!selectFrom) {
			selectFrom = value;
		} else if (!selectTo) {
			if (value > selectFrom) {
				selectTo = value;
			} else if (
				this.props.allowDaySelect &&
				value.toDateString() === selectFrom.toDateString()
			) {
				selectTo = value;
			} else {
				selectFrom = value;
			}
		} else if (selectFrom && selectTo) {
			selectFrom = value;
			selectTo = null;
		}

		months = months.map((month) => {
			return month.map((day) => {
				return {
					date: day.date,
					status: this.getStatus(day.date, selectFrom, selectTo),
					disabled: day.disabled
				}
			})
		});

		if (this.props.rangeSelect) {
			this.selectFrom = selectFrom;
			this.selectTo = selectTo;
		} else {
			this.selectFrom = this.selectTo = selectFrom;
		}

		this.months = months;

		this.props.onSelectionChange(value, this.prevValue);
		this.props.onSelectedDatesChange(this.selectFrom, this.selectTo);
		this.prevValue = value;

		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(months)
		});
	}

	getStatus(date, selectFrom, selectTo) {
		if (selectFrom && selectTo) {
			if (selectTo.toDateString() === selectFrom.toDateString() &&
					selectFrom.toDateString() === date.toDateString()) {
				return 'selectedSingleDay';
			}
		}
		if (selectFrom) {
			if (selectFrom.toDateString() === date.toDateString()) {
				return 'selectedFrom';
			}
		}
		if (selectTo) {
			if (selectTo.toDateString() === date.toDateString()) {
				return 'selectedTo';
			}
		}
		if (selectFrom && selectTo) {
			if (selectFrom < date && date < selectTo) {
				return 'inRange';
			}
		}
		return 'common';
	}

	render() {
		let {style, isFutureDate} = this.props;
		let directionStyles = {};

		if (!isFutureDate) {
			directionStyles = {
				transform: [{scaleY: -1}]
			}
		}

		return (
			<ListView
				ref={ref => this.listViewRef = ref}
				initialListSize={5}
				scrollRenderAheadDistance={1200}
				style={[styles.listViewContainer, directionStyles, style]}
				dataSource={this.state.dataSource}
				{...testID('test.scroll')}
				renderRow={(month) => {
					return (
						<Month
							{...this.props}
							days={month}
							style={[styles.month, directionStyles]}
							changeSelection={this.changeSelection}
						/>
					);
				}}
			/>
		);
	}
}

const styles = StyleSheet.create({
	listViewContainer: {
		backgroundColor: 'white',
		alignSelf: 'center',
	},
	month: {}
});
