<template>
  <div>
    <div class="el-card__body">
      <div class="el-row">
        <div role="group" aria-label="checkbox-group" class="el-checkbox-group">
          <div
            class="el-col el-col-24 el-col-xs-12 el-col-sm-6 el-col-md-6 el-col-lg-4 el-col-xl-4"
          >
            <div class="el-card cardItem is-always-shadow" style="margin: 5px;">
              <!---->
              <div class="el-card__body" style="padding: 0px;">
             
                  <label class="el-checkbox select-attachment-checkbox is-checked">
                    <span class="el-checkbox__input is-checked">
                      <span class="el-checkbox__inner"></span>
                      <input
                        type="checkbox"
                        aria-hidden="false"
                        class="el-checkbox__original"
                        value="2"
                      />
                    </span>
                    <span class="el-checkbox__label">2</span>
                  </label>
            
                <div
                  id="attachment2"
                  class="cardAttachmentDetail"
                  style="border: 2px solid rgb(24, 144, 255);"
                >
                  <div>
                    <div class="attach-thumb">
                      <span style="display: none;">当前格式不支持预览</span>
                      <img src="https://redyublog.oss-cn-beijing.aliyuncs.com/老刘_1577881958621.png" />
                    </div>
                    <div class="ant-card-meta" style="padding: 0.8rem;">
                      <div class="ant-card-meta-detail">
                        <div class="ant-card-meta-description">
                          <span>老刘</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="ant-col-xs-12 ant-col-sm-12 ant-col-md-6 ant-col-lg-4 ant-col-xl-4 ant-col-xxl-4"
            style="padding-left: 6px; padding-right: 6px;"
          >
            <div class="ant-list-item">
              <div class="ant-list-item-content ant-list-item-content-single">
                <div class="ant-card ant-card-bordered ant-card-hoverable">
                  <div class="ant-card-body" style="padding: 0px;">
                    <div class="attach-thumb">
                      <span style="display: none;">当前格式不支持预览</span>
                      <img
                        src="https://redyublog.oss-cn-beijing.aliyuncs.com/qq_1576930829582.jpg"
                        loading="lazy"
                      />
                    </div>
                    <div class="ant-card-meta" style="padding: 0.8rem;">
                      <div class="ant-card-meta-detail">
                        <div class="ant-card-meta-description">
                          <span>qq</span>
                        </div>
                      </div>
                    </div>
                    <label class="select-attachment-checkbox ant-checkbox-wrapper" style>
                      <span class="ant-checkbox">
                        <input type="checkbox" class="ant-checkbox-input" value />
                        <span class="ant-checkbox-inner"></span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="el-pagination" style="text-align: center;">
        <span class="el-pagination__total">共 34 条</span>
        <span class="el-pagination__sizes">
          <div class="el-select el-select--mini">
            <!---->
            <div class="el-input el-input--mini el-input--suffix">
              <!---->
              <input
                type="text"
                readonly="readonly"
                autocomplete="off"
                placeholder="请选择"
                class="el-input__inner"
              />
              <!---->
              <span class="el-input__suffix">
                <span class="el-input__suffix-inner">
                  <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                  <!---->
                  <!---->
                  <!---->
                  <!---->
                  <!---->
                </span>
                <!---->
              </span>
              <!---->
              <!---->
            </div>
            <div class="el-select-dropdown el-popper" style="display: none; min-width: 110px;">
              <div class="el-scrollbar" style>
                <div
                  class="el-select-dropdown__wrap el-scrollbar__wrap"
                  style="margin-bottom: -6px; margin-right: -6px;"
                >
                  <ul class="el-scrollbar__view el-select-dropdown__list">
                    <!---->
                    <li class="el-select-dropdown__item">
                      <span>12条/页</span>
                    </li>
                    <li class="el-select-dropdown__item selected">
                      <span>18条/页</span>
                    </li>
                    <li class="el-select-dropdown__item">
                      <span>24条/页</span>
                    </li>
                    <li class="el-select-dropdown__item">
                      <span>30条/页</span>
                    </li>
                  </ul>
                </div>
                <div class="el-scrollbar__bar is-horizontal">
                  <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
                </div>
                <div class="el-scrollbar__bar is-vertical">
                  <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
                </div>
              </div>
              <!---->
            </div>
          </div>
        </span>
        <button type="button" disabled="disabled" class="btn-prev">
          <i class="el-icon el-icon-arrow-left"></i>
        </button>
        <ul class="el-pager">
          <li class="number active">1</li>
          <!---->
          <!---->
          <li class="number">2</li>
        </ul>
        <button type="button" class="btn-next">
          <i class="el-icon el-icon-arrow-right"></i>
        </button>
        <span class="el-pagination__jump">
          前往
          <div class="el-input el-pagination__editor is-in-pagination">
            <!---->
            <input type="number" autocomplete="off" min="1" class="el-input__inner" max="2" />
            <!---->
            <!---->
            <!---->
            <!---->
          </div>页
        </span>
      </div>
    </div>

    <div class="ant-col-24" style="padding-left: 6px;padding-right: 6px;">
      <div class="ant-list ant-list-split ant-list-grid">
        <div class="ant-spin-nested-loading">
          <div class="ant-spin-container">
            <div class="ant-row" style="margin-left: -6px; margin-right: -6px;">
              <div
                class="ant-col-xs-12 ant-col-sm-12 ant-col-md-6 ant-col-lg-4 ant-col-xl-4 ant-col-xxl-4"
                style="padding-left: 6px; padding-right: 6px;"
              >
                <div class="ant-list-item">
                  <div class="ant-list-item-content ant-list-item-content-single">
                    <div class="ant-card ant-card-bordered ant-card-hoverable">
                      <div class="ant-card-body" style="padding: 0px;">
                        <div class="attach-thumb">
                          <span style="display: none;">当前格式不支持预览</span>
                          <img
                            src="https://redyublog.oss-cn-beijing.aliyuncs.com/qq_1576930829582.jpg"
                            loading="lazy"
                          />
                        </div>
                        <div class="ant-card-meta" style="padding: 0.8rem;">
                          <div class="ant-card-meta-detail">
                            <div class="ant-card-meta-description">
                              <span>qq</span>
                            </div>
                          </div>
                        </div>
                        <label class="select-attachment-checkbox ant-checkbox-wrapper" style>
                          <span class="ant-checkbox">
                            <input type="checkbox" class="ant-checkbox-input" value />
                            <span class="ant-checkbox-inner"></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>