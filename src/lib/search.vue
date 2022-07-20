<template>
    <div class="filtered-search-box"
         :class="{true:'focus',false:''}[visiable.focusOnOrNot]">
        <div class="filtered-search-box-input-container droplab-dropdown">
            <div class="filtered-scroll-container">
                <div class="scroll-box">
                    <div class="scroll-box-div">
                        <div id="filtered-scroll-wrap" ref="filteredScrollWrapRef"
                             class="scroll-wrap">
                            <ul ref="filteredScrollWidthRef" id="filtered-scroll-width"
                                class="tokens-container list-unstyled">
                                <li v-for="(filterObj,i) in filteredObj"
                                    :key="i"
                                    class="filtered-search-token">
                                    <div class="selectable"
                                         :class="{true:'selectType',false:''}[visiable.editColorNum===i&&visiable.isEditType]">
                                        <div v-if="filterObj.name"
                                             class="name"
                                             :class="{true:'searchTxt',false:''}[filterObj.oKey=='search']"
                                             @click="editTypeFn(filterObj,i,$event)">{{ filterObj.oKey=='search'?filterObj.name:filterObj.name }}</div>
                                        <!-- 新增搜索筛选条件 -->
                                        <!-- 已选第一个下拉框的条件字段、未选计算符号、是否加计算符号、输入框未填值 -->
                                        <div v-if="(filterObj.name && !filterObj.calcSign && filterObj.isCalcSign &&!filterObj.value.name) || isChangingSign"
                                             class="filtered-search-input-dropdown-menu dropdown-menu filter-dropdown-wrap"
                                             id="searchCalc">
                                            <ul class="filter-dropdown">
                                                <li class="filter-dropdown-item"
                                                    v-for="(item, index) in calcSignJson[filterObj.oKey]"
                                                    :key="index"
                                                    :class="{true:'filter-dropdown-item-active',flase:''}[visiable.keypressWitch==-1]">
                                                    <button class="btn btn-link filter-dropdown-item-btn"
                                                            type="button"
                                                            @click="clickCalcSign(filterObj,item,i)">
                                                        <span>{{item.sign}}</span><span style="float: right;">{{item.text}}</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>

                                        <div class="value-container"
                                             v-if="filterObj.calcSign"
                                             @click="isChangingSignFn(filterObj,i,$event)"
                                             :class="{true:'selected',false:''}[isChangingSign]">
                                            <div class="value">{{filterObj.calcSign}}</div>
                                        </div>

                                        <div v-if="filterObj.value.name"
                                             class="value-container"
                                             :class="{true:'selected',false:''}[visiable.editColorNum===i&&visiable.isEdit]"
                                             @click="editFilteredFn(filterObj,i,$event)">
                                            <div class="value">{{ filterObj.value.name }}</div>
                                            <div class="remove-token inverted"
                                                 @click="deleteOption(i,$event)">
                                                <i class="el-icon-close" />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="input-token">
                        <input id="filteredToggle"
                               ref="filteredToggleRef"
                               v-model="visiable.filterInputValue"
                               autocomplete="off"
                               class="form-control filtered-search"
                               placeholder="按Enter搜索或过滤结果"
                               @keyup.enter="searchDataFn($event)"
                               @keyup.delete="searchDataFn($event)"
                               @click="filterInputClick($event)">
                        <div v-show="visiable.firstDropBool"
                             id="filterFirstMenu"
                             class="filtered-search-input-dropdown-menu dropdown-menu"
                             style="display:block">
                            <ul class="filter-dropdown">
                                <li class="filter-dropdown-item"
                                    :class="{true:'filter-dropdown-item-active',flase:''}[visiable.keypressWitch==-1]">
                                    <button class="btn btn-link"
                                            type="button"
                                            @click="searchDataFn()">
                                        <i class="el-icon-search" />
                                        <span>点击搜索</span>
                                    </button>
                                </li>
                                <li v-for="(itemX,itemY,j) in searchOptionCopy"
                                    :key="j"
                                    class="filter-dropdown-item"
                                    :class="{true:'filter-dropdown-item-active',flase:''}[visiable.keypressWitch==j]">
                                    <button class="btn btn-link"
                                            type="button"
                                            @click="selectType(itemY,itemX,$event)">
                                        <span class="js-filter-tag dropdown-light-content">{{ itemX.name }}</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div v-show="visiable.secondDropBool"
                             id="filterSecondMenu"
                             class="filtered-search-input-dropdown-menu dropdown-menu"
                             style="display:block">
                            <ul v-if="searchOptionSave[visiable.typeName]">
                                <li v-for="(userItem,k) in searchOptionSave[visiable.typeName].dropItem"
                                    :key="k"
                                    class="filter-dropdown-item js-current-user"
                                    :class="{true:'filter-dropdown-item-active',flase:''}[visiable.secondKeypressWitch==k]">
                                    <button class="btn btn-link dropdown-user"
                                            type="button"
                                            @click="secondItemClick(userItem,$event)">
                                        <div class="dropdown-user-details">
                                            <i v-if="userItem.showCheckIcon"
                                               class="el-icon el-icon-check checkFil" />
                                            <span class="filPad">{{ userItem.name }}</span>
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button v-if="filteredObj.length!=0"
                class="clear-search"
                type="button">
            <i class="el-icon-close"
               @click="deleteAll()" />
        </button>
    </div>
</template>

<script>
export default {
    name: 'easy-search',
    components: {},
    props: {
        easyOption: {
            type: Object,
            default: null
        },
        easyChange: {
            type: Function,
            default: null
        }
    },
    data () {
        return {
            visiable: {
                firstDropBool: false, // 类型的下拉
                secondDropBool: false, // 类型选项的下拉
                keypressWitch: -2, // 类型的keypress
                secondKeypressWitch: -1, // 类型的选项的keypress
                editNum: 0, // 当前编辑的索引
                typeName: '', // 当前编辑的键值
                isEdit: false, // 是否是编辑状态
                editColorNum: '', // 点击的选项的索引
                focusOnOrNot: false// 输入框是否在焦点中
            },
            filteredObj: [],
            filterSelectDrop: [],
            searchOptionSave: this.easyOption,
            searchOptionCopy: this.easyOption,
            calcSignJson: {},
            isChangingSign: false,
            calcDefaultObj: {
                'EqualTo': { sign: '=', type: '', text: '等于' },
                'NotEqualTo': { sign: '!=', type: 'NotEqualTo', text: '不等于' },
                'Contains': { sign: '⊆', type: 'Contains', text: '包含' },
                'NotContains': { sign: '⊄', type: 'NotContains', text: '不包含' }
            }
        };
    },
    created () { },
    mounted () {
        var that = this;
        document.addEventListener('click', function () {
            that.contentClick();
        }, false);
    },
    methods: {
        selectType (tX, tY, event) {
            // 如果是点击类型的编辑
            if (this.visiable.isEditType) {
                this.visiable.isEditType = false;
                this.filteredObj.splice(this.visiable.editNum, 1);
                this.visiable.editNum = this.filteredObj.length - 1;
                this.visiable.editColorNum = '';
            }

            // 获取已选的展示的条件的长度
            var filteredDataLen = this.filteredObj.length;

            // 已经有值 新加
            if (filteredDataLen === 0 || this.filteredObj[this.visiable.editNum].oKey === 'search' || this.filteredObj[this.visiable.editNum].value) {
                var fO = {
                    oKey: tX,
                    name: tY.name,
                    value: '',
                    valueType: tY.valueType,
                    isCalcSign: tY.isCalcSign
                };

                this.filteredObj.push(fO);
            } else {
                this.filteredObj[this.visiable.editNum] = {
                    oKey: tX,
                    name: tY.name,
                    value: '',
                    valueType: '',
                    isCalcSign: tY.isCalcSign
                };
            }

            // 最后一个
            this.visiable.editNum = this.filteredObj.length - 1;
            // //当前编辑的条件的键值
            this.visiable.typeName = tX;
            // 输入框获取焦点
            //显示中间计算符号区域
            var calcDefaultObj = this.calcDefaultObj;
            if (tY.isCalcSign || tY.isCalcSign instanceof Array) {
                this.visiable.firstDropBool = false;
                if (!this.calcSignJson[tX]) {
                    var calcSignArr = [];
                    if (tY.isCalcSign === true) {
                        tY.isCalcSign = ['EqualTo', 'NotEqualTo', 'Contains', 'NotContains'];
                    }
                    tY.isCalcSign.forEach(function (item, i) {
                        calcSignArr.push(calcDefaultObj[item]);
                    })
                    this.$set(this.calcSignJson, tX, calcSignArr)
                    // this.calcSignJson[tX] = calcSignArr
                }

            } else {
                this.filterInputClick();
            }

            if (tY.defaultValue !== undefined) {
                // 判断是否有默认值 defaultValue
                this.$set(this.visiable, 'filterInputValue', tY.defaultValue);
            } else {
                this.visiable.filterInputValue = '';
            }

            // 滚动条
            this.scrollXtop();

            // 阻止冒泡
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        isChangingSignFn () {
            this.isChangingSign = true;
        },
        filterOptionFn () {
            var filterArr = [];
            this.searchOptionCopy = {};
            this.filteredObj.forEach(function (foVal, foKey) {
                filterArr.push(foVal.oKey);
            });
            for (const a in this.searchOptionSave) {
                if (!this.searchOptionSave[a].isMoreTime && filterArr.indexOf(a) === -1) {
                    this.searchOptionCopy[a] = this.searchOptionSave[a];
                }
            }
            //   this.searchOptionSave.forEach(function (fiVal, fiKey) {
            //     if (!fiVal.isMoreTime && filterArr.indexOf(fiKey) === -1) {
            //       this.searchOptionCopy[fiKey] = fiVal;
            //     }
            //   })
        },
        filterInputClick (event) {
            // 先都隐藏
            this.visiable.firstDropBool = false;
            this.visiable.secondDropBool = false;

            // 遍历筛选
            this.filterOptionFn();

            // 获取已选的展示的条件的长度
            var filteredDataLen = this.filteredObj.length;
            if ((filteredDataLen === 0 || this.filteredObj[this.visiable.editNum].oKey === 'search' || this.filteredObj[this.visiable.editNum].value || this.visiable.isEditType) && !this.visiable.isEdit) {
                this.visiable.firstDropBool = true;
            } else if (this.searchOptionSave[this.visiable.typeName]) {
                // 判断 是否有下拉选项
                if (this.searchOptionSave[this.visiable.typeName].dropItem && this.searchOptionSave[this.visiable.typeName].dropItem.length !== 0) {
                    this.visiable.secondDropBool = true;
                    // 判断是否可多次选择
                    if (this.searchOptionSave[this.visiable.typeName].isMutil) {
                        // this.searchOptionSave[this.visiable.typeName].dropItem.forEach(function(clearObj) {
                        //   clearObj.showCheckIcon = false;
                        // });
                        var splitVal = String(this.filteredObj[this.visiable.editNum].value.val).split(',')
                        if (splitVal && splitVal !== undefined) {
                            var dropItem = this.searchOptionSave[this.visiable.typeName].dropItem;
                            splitVal.forEach(function (splitItem) {
                                dropItem.forEach(function (clearObj) {
                                    if (splitItem === clearObj.val) {
                                        clearObj.showCheckIcon = true;
                                    }
                                })
                            })
                        }
                    }
                }
            }

            this.visiable.keypressWitch = -2;
            this.visiable.secondKeypressWitch = -1;
            if (!this.visiable.isEdit) {
                this.scrollXtop();
            }

            // document.getElementById('filteredToggle').focus();
            this.$refs.filteredToggleRef.focus();
            this.visiable.focusOnOrNot = true;

            // 阻止冒泡
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
        },

        clickCalcSign (obj, item, outerIndex) {
            this.filteredObj[outerIndex].calcSign = item.sign;
            this.filteredObj[outerIndex].calcType = item.type;
            // setTimeout(function() {
            if (this.isChangingSign) {
                this.isChangingSign = false;
            } else {
                this.filterInputClick();
            }

            // }, 0);

        },

        secondItemClick (secondV, event) {
            // 获取已选的展示的条件的长度
            // var filteredDataLen = this.filteredObj.length;

            // 判断是否是多选
            if (this.searchOptionSave[this.visiable.typeName].isMutil) {
                // 是否选中
                secondV.showCheckIcon = !secondV.showCheckIcon;
                var sObj = {};
                this.searchOptionSave[this.visiable.typeName].dropItem.forEach(function (o) {
                    if (o.showCheckIcon) {
                        if (sObj.name) {
                            sObj.name += o.name + ',';
                            sObj.val += o.val + ',';
                        } else {
                            sObj.name = o.name + ',';
                            if (o.val) {
                                sObj.val = o.val + ',';
                            }
                        }
                    }
                });
                if (sObj.name) {
                    sObj.name = sObj.name.substr(0, sObj.name.length - 1);
                    sObj.val = sObj.val.substr(0, sObj.val.length - 1);

                    this.filteredObj[this.visiable.editNum].value = sObj;
                    // this.$set(this.visiable, 'typeName', tX)
                } else {
                    this.filteredObj[this.visiable.editNum].value = '';
                }
            } else {
                this.filteredObj[this.visiable.editNum].value = secondV;

                this.filteredObj[this.visiable.editNum].value.name = this.filteredObj[this.visiable.editNum].value.name;

                this.visiable.firstDropBool = true;
                this.visiable.secondDropBool = false;
                this.visiable.keypressWitch = -2;
                this.visiable.secondKeypressWitch = -1;
                this.visiable.typeName = '';
                // 输入框获取焦点
                document.getElementById('filteredToggle').focus();
                this.visiable.focusOnOrNot = true;
            }

            this.visiable.filterInputValue = '';
            this.visiable.editColorNum = '';
            // 阻止冒泡
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        searchDataFn (e) {
            // enter
            if (!e || e.keyCode === 13) {
                // 没有下拉框的enter 搜索  或者 有下拉框enter点击搜索按钮
                if ((this.visiable.keypressWitch === -2 || this.visiable.keypressWitch === -1) && this.visiable.secondKeypressWitch === -1) {
                    this.filteredOption = {
                        paramsObj: {},
                        paramsStr: ''
                    };

                    // 输入框有值
                    if (this.visiable.filterInputValue) {
                        this.handleInputFn(this.visiable.filterInputValue);
                    }
                    var searchStr = '';
                    for (const i in this.filteredObj) {
                        if (this.filteredObj[i].oKey === 'search') {
                            searchStr += ' ' + this.filteredObj[i].name;
                        } else if (this.filteredObj[i].value.val) {
                            var calcType = this.filteredObj[i].calcType ? this.filteredObj[i].calcType : '';
                            if (this.filteredOption.paramsObj[this.filteredObj[i].oKey]) {
                                // this.filteredOption.paramsObj[this.filteredObj[i].oKey] += ',' + this.filteredObj[i].value.val;
                                this.filteredOption.paramsObj[this.filteredObj[i].oKey] += ',' + { type: calcType, sign: this.filteredObj[i].calcSign, val: this.filteredObj[i].value.val }

                            } else {
                                // this.filteredOption.paramsObj[this.filteredObj[i].oKey] = this.filteredObj[i].value.val;
                                this.filteredOption.paramsObj[this.filteredObj[i].oKey] = { type: calcType, sign: this.filteredObj[i].calcSign, val: this.filteredObj[i].value.val };
                            }
                        }
                    }

                    searchStr && (this.filteredOption.paramsObj['search'] = searchStr);
                    // console.log(this.filteredOption.paramsObj);
                    // 解决移动端click事件的滞后性
                    this.$nextTick(() => {
                        // document.getElementById('filteredToggle').blur();
                        this.$refs.filteredToggleRef.blur();
                        // 重置
                        this.resectProperty();
                        this.scrollXtop();

                        this.$emit('easyChange', this.filteredOption.paramsObj);

                        // this.getSearchFn();
                    }, 310);
                    // return为了单元测试使用
                    return this.filteredOption.paramsObj
                } else {
                    if (this.visiable.firstDropBool) {
                        // enter下拉的选项  选中的值赋值
                        if (this.filterSelectDrop.length !== 0) {
                            // key值
                            var inKey = Object.keys(this.filterSelectDrop[0])[0];
                            // 等于触发类型的下拉点击
                            this.selectType(inKey, this.filterSelectDrop[0][inKey]);
                        }
                    } else if (this.visiable.secondDropBool) {
                        this.secondItemClick(this.filterSelectDrop[0]);
                    }
                }
            } else if (e.keyCode === 8) {
                // 键盘 删除 键
                if (!this.visiable.filterInputValue) {
                    // 删除最后一项
                    this.filteredObj.pop();
                    this.visiable.firstDropBool = true;
                    this.visiable.secondDropBool = false;
                    this.visiable.isEdit = false;
                    this.visiable.keypressWitch = -2;
                    this.visiable.secondKeypressWitch = -1;

                    this.filterOptionFn();
                    this.visiable.editNum = this.filteredObj.length === 0 ? 0 : this.filteredObj.length - 1;
                } else if (this.visiable.isEdit && this.visiable.filterInputValue.length === 1) {
                    this.visiable.isEdit = false;
                    if (this.filteredObj[this.visiable.editNum].oKey === 'search') {
                        this.filteredObj.splice(this.visiable.editNum, 1);
                    } else {
                        this.filteredObj[this.visiable.editNum].value = '';
                    }
                }
            } else if (e.keyCode === 38) {
                if (this.visiable.firstDropBool) {
                    // 键盘 上 键
                    if (this.visiable.keypressWitch > -2) {
                        this.visiable.keypressWitch--;
                    }

                    let filterResultsArr = [];
                    this.filterSelectDrop = [];
                    // 获取下拉列表的长度  对象转数组
                    filterResultsArr = this.ObjectToArrFn(this.filterResults);

                    // 保存当前选中的下拉选项的值
                    if (this.visiable.keypressWitch >= 0) {
                        this.filterSelectDrop.push(filterResultsArr[this.visiable.keypressWitch]);
                    }
                } else if (this.visiable.secondDropBool) {
                    // 键盘 上 键
                    if (this.visiable.secondKeypressWitch > -1) {
                        this.visiable.secondKeypressWitch--;
                    }
                    this.filterSelectDrop = [];
                    // 保存当前选中的下拉选项的值
                    if (this.visiable.secondKeypressWitch >= 0) {
                        this.filterSelectDrop.push(this.secondFilterResults[this.visiable.secondKeypressWitch]);
                    }
                }
            } else if (e.keyCode === 40) {
                if (this.visiable.firstDropBool) {
                    // 键盘 下 键
                    let filterResultsArr = [];
                    this.filterSelectDrop = [];
                    // 获取下拉列表的长度  对象转数组
                    filterResultsArr = this.ObjectToArrFn(this.filterResults);

                    if (this.visiable.keypressWitch < filterResultsArr.length - 1) {
                        this.visiable.keypressWitch++;
                    }
                    // 保存当前选中的下拉选项的值
                    if (this.visiable.keypressWitch >= 0) {
                        this.filterSelectDrop.push(filterResultsArr[this.visiable.keypressWitch]);
                    }
                } else if (this.visiable.secondDropBool) {
                    this.filterSelectDrop = [];
                    if (this.visiable.secondKeypressWitch < this.secondFilterResults.length - 1) {
                        this.visiable.secondKeypressWitch++;
                    }
                    // 保存当前选中的下拉选项的值
                    if (this.visiable.secondKeypressWitch >= 0) {
                        this.filterSelectDrop.push(this.secondFilterResults[this.visiable.secondKeypressWitch]);
                    }
                }
            }
        },
        editFilteredFn (editObj, editIndex, editEvent) {
            this.resectProperty();

            this.visiable.editNum = editIndex;
            // this.$set(this.visiable, 'typeName', editObj.oKey)
            this.visiable.typeName = editObj.oKey;
            this.visiable.isEdit = true;
            this.visiable.editColorNum = editIndex;
            this.visiable.filterInputValue = '';
            if (editObj.valueType === 2) {
                this.visiable.filterInputValue = editObj.value.val;
            } else if (editObj.valueType === 0 && editObj.oKey === 'search') {
                this.visiable.filterInputValue = editObj.name;
            }

            this.filterInputClick();

            // 阻止冒泡
            if (editEvent) {
                editEvent.preventDefault();
                editEvent.stopPropagation();
            }
        },
        editTypeFn (editObj, editIndex, editEvent) {
            this.resectProperty();

            this.visiable.editNum = editIndex;
            // this.visiable.typeName = editObj.oKey;
            this.visiable.isEditType = true;
            this.visiable.editColorNum = editIndex;

            this.filterInputClick();

            // 阻止冒泡
            if (editEvent) {
                editEvent.preventDefault();
                editEvent.stopPropagation();
            }
        },
        handleInputFn (intVal) {
            // 获取已选的展示的条件的长度
            var filteredDataLen = this.filteredObj.length;
            if ((filteredDataLen === 0 || this.filteredObj[this.visiable.editNum].value) && !this.visiable.isEdit) {
                var fO = {
                    oKey: 'search',
                    name: intVal,
                    value: '',
                    valueType: 0
                };
                this.filteredObj.push(fO);
            } else if (this.filteredObj[this.visiable.editNum].oKey === 'search' && !this.visiable.isEdit) {
                this.filteredObj[this.visiable.editNum].name += ' ' + intVal;
            } else {
                if (this.visiable.isEdit && this.filteredObj[this.visiable.editNum].oKey === 'search') {
                    this.filteredObj[this.visiable.editNum].name = intVal;
                } else {
                    var inputObj = {
                        name: intVal,
                        val: intVal
                    };
                    this.filteredObj[this.visiable.editNum].value = inputObj;
                }
            }
            this.visiable.filterInputValue = '';
        },
        scrollXtop () {
            this.$nextTick(() => {
                var filterScrollWidth = this.$refs.filteredScrollWidthRef.offsetWidth;

                this.$refs.filteredScrollWrapRef.scrollLeft = filterScrollWidth;
            }, 0);
        },
        contentClick () {
            // 输入框失去焦点 赋值
            if (this.visiable.filterInputValue) {
                this.handleInputFn(this.visiable.filterInputValue);
                this.scrollXtop();
            }
            // 重置
            this.resectProperty();
        },
        resectProperty () {
            this.visiable.firstDropBool = false;
            this.visiable.secondDropBool = false;
            this.visiable.keypressWitch = -2;
            this.visiable.secondKeypressWitch = -1;
            this.visiable.focusOnOrNot = false;
            this.visiable.editNum = this.filteredObj.length === 0 ? 0 : this.filteredObj.length - 1;
            this.visiable.typeName = this.filteredObj.length === 0 ? '' : this.filteredObj[this.filteredObj.length - 1].oKey;
            this.visiable.isEdit = false;
            this.visiable.isEditType = false;
            this.visiable.editColorNum = '';
            this.visiable.filterInputValue = '';
        },
        deleteOption (index, delEvent) {
            this.visiable.filterInputValue = '';
            if (this.searchOptionSave[this.visiable.typeName] && this.searchOptionSave[this.visiable.typeName].dropItem) {
                this.searchOptionSave[this.visiable.typeName].dropItem.forEach(function (clearObj) {
                    clearObj.showCheckIcon = false;
                })
            }
            this.filteredObj.splice(index, 1);
            this.visiable.isEdit = false;
            this.visiable.isEditType = false;
            this.filterOptionFn();
            this.visiable.editNum = this.filteredObj.length === 0 ? 0 : this.filteredObj.length - 1;
            // 阻止冒泡
            if (delEvent) {
                delEvent.preventDefault();
                delEvent.stopPropagation();
            }
        },
        deleteAll () {
            this.visiable.filterInputValue = '';
            if (this.searchOptionSave[this.visiable.typeName] && this.searchOptionSave[this.visiable.typeName].dropItem) {
                this.searchOptionSave[this.visiable.typeName].dropItem.forEach(function (clearObj) {
                    clearObj.showCheckIcon = false;
                })
            }
            this.filteredObj = [];
            this.visiable.editNum = 0;
            // 重新赋值
            this.searchOptionCopy = this.searchOption;

            this.filteredOption = {
                paramsObj: {},
                paramsStr: ''
            };
            var that = this;
            setTimeout(function () {
                that.$emit('easyChange', that.filteredOption.paramsObj);
            }, 0);
        },
        ObjectToArrFn (objCur) {
            var returnResultsArr = [];
            objCur.forEach(function (filItem, filItemKey) {
                var o = {};
                o[filItemKey] = filItem;
                returnResultsArr.push(o);
            });
            return returnResultsArr;
        }

    }
};
</script>
<style scoped lang="css">
.easysearch {
    display: flex;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    width: 100%;
    overflow-x: auto;
}
.easyInfo {
    display: flex;
}
.easyInput {
    flex: 1 0 170px;
}
/*过滤搜索*/
.filtered-search-box {
    position: relative;
    flex: 1;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    font-size: 14px;
    min-width: 0;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    box-sizing: border-box;
}

.filtered-search-box-input-container {
    flex: 1;
    position: relative;
    min-width: 0;
    padding-left: 5px;
}

.filtered-scroll-container {
    display: -webkit-flex;
    display: flex;
    white-space: nowrap;
    width: 100%;
}

.filtered-search-box .scroll-box {
    display: -webkit-flex;
    display: flex;
    width: 100%;
}
.filtered-search-box .scroll-box .scroll-box-div {
    position: relative !important;
    max-width: 75%;
}

.filtered-search-box .tokens-container {
    display: -webkit-flex;
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    position: static !important;
}

.filtered-search-box .scroll-wrap {
    display: -webkit-flex;
    display: flex;
    /*flex-shrink: 0;*/
    overflow-x: auto;
    white-space: nowrap;
}

.filtered-search-box .input-token {
    padding: 0;
    flex: 1 0 170px;
    position: relative !important;
}

.filtered-search-token {
    display: -webkit-flex;
    display: flex;
    margin-top: 4px;
    margin-bottom: 4px;
}

.filtered-search-box .form-control,
.filtered-search-box .search form,
.search .filtered-search-box form {
    position: relative;
    padding-right: 25px;
    padding-left: 0;
    height: 34px;
    line-height: inherit;
    border-color: transparent;
    border-radius: 2px;
    padding: 6px 10px;
    display: block;
    width: 100%;
}
.filtered-search-box input.form-control {
    background-color: transparent;
}

.filtered-search-token .selectable,
.filtered-search-term .selectable {
    display: -webkit-flex;
    display: flex;
}

.filtered-search-token .name,
.filtered-search-term .name {
    background-color: #f8f8f8;
    color: rgba(0, 0, 0, 0.55);
    border-radius: 2px 0 0 2px;
    margin-right: 1px;
    text-transform: capitalize;
}

.filtered-search-token .name,
.filtered-search-token .value,
.filtered-search-term .name,
.filtered-search-term .value {
    display: inline-block;
    padding: 4px 7px;
}

.filtered-search-token .value-container,
.filtered-search-term .value-container {
    background-color: #f0f0f0;
    color: rgba(0, 0, 0, 0.85);
    border-radius: 0 2px 2px 0;
    margin-right: 1px;
    padding-right: 8px;
}

.filtered-search-token .value,
.filtered-search-term .value {
    padding-right: 0;
}

.filtered-search-token .remove-token,
.filtered-search-term .remove-token {
    display: inline-block;
    padding-left: 4px;
    padding-right: 0;
    cursor: pointer;
}

.filtered-search-token .remove-token .el-icon-close,
.filtered-search-term .remove-token .el-icon-close {
    color: #c4c4c4;
}

.filtered-search-box .clear-search {
    width: 35px;
    background-color: #fff;
    border: 0;
    outline: none;
    z-index: 1;
    cursor: pointer;
    height: 32px;
    position: relative;
    top: 1px;
    left: -1px;
}

.filtered-search-box .form-control:focus,
.filtered-search-box .common-note-form .md-area.is-focused,
.common-note-form .filtered-search-box .md-area.is-focused,
.filtered-search-box .search form:focus,
.search .filtered-search-box form:focus,
.filtered-search-box .search.search-active form,
.search.search-active .filtered-search-box form,
.filtered-search-box .form-control:hover,
.filtered-search-box .filtered-search-box:hover,
.filtered-search-box .search form:hover,
.search .filtered-search-box form:hover {
    outline: none;
    border-color: transparent;
    box-shadow: none;
}

.filtered-search-box .el-icon-close,
.filtered-search-box .clearable-input .clear-icon,
.clearable-input .filtered-search-box .clear-icon {
    right: 10px;
    color: #c4c4c4;
}

.filtered-search-box .clear-search {
    width: 35px;
    background-color: #fff;
    border: 0;
    outline: none;
    z-index: 1;
}

.filtered-search-box .clear-search:hover .el-icon-close,
.filtered-search-box .clear-search:hover .clearable-input .clear-icon,
.clearable-input .filtered-search-box .clear-search:hover .clear-icon,
.filtered-search-token .remove-token.inverted .el-icon-close:hover {
    color: #444;
}

.dropdown-menu ul,
.dropdown-menu-nav ul {
    margin: 0;
    padding: 0;
}

.droplab-dropdown .dropdown-menu li {
    cursor: pointer;
    text-align: left;
    list-style: none;
    padding: 0 1px;
}

.filtered-search-box-input-container .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 160px;
    padding: 5px 0;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    max-width: 280px;
}

.dropdown-menu li button:hover {
    background-color: #eee;
    color: #2e2e2e;
    outline: 0;
    text-decoration: none;
}

.droplab-dropdown .dropdown-menu li > a,
.droplab-dropdown .dropdown-menu li > button {
    display: flex;
    width: 100%;
    margin: 0;
    text-align: left;
}

.btn {
    font-weight: 500;
    border-radius: 2px;
    background-color: #fff;
    outline: 0 !important;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
    cursor: pointer;
    text-transform: none;
    border-color: transparent;
}
.btn-link {
    color: #58666e;
}

.filtered-search-term .selected {
    background-color: #ebebeb;
}

.filtered-search-token .selected,
.filtered-search-token .selectType .name {
    background-color: #ababab;
}

.filtered-search-box .dropdown-user-details {
    position: relative;
}

.filtered-search-box .checkFil {
    position: absolute;
    top: 3px;
    left: 0px;
}

.filtered-search-box .filPad {
    padding-left: 20px;
}

.filtered-search-box .searchTxt {
    background-color: inherit;
    color: #000;
    text-transform: none;
}

.filtered-search-box .filter-dropdown-wrap {
    display: block;
    left: 100%;
}
.filtered-search-box .filter-dropdown-item-active button {
    background-color: #eee;
    color: #2e2e2e;
    outline: 0;
}
.filter-dropdown-item{
    display: list-item;
}
.filter-dropdown-item-btn {
    text-decoration: none;
    display: block !important;
}
.filtered-search-box.focus,
.filtered-search-box.focus:hover {
    border-color: #73afea;
    box-shadow: 0 0 4px rgba(115, 175, 234, 0.4);
}
.el-icon-search {
    padding: 3px 5px 0 0;
}
/*过滤搜索*/
</style>
