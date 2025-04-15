
/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GeneratePropsCpp.js
 */

#include <react/renderer/components/RNCWebViewSpec/Props.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/propsConversions.h>

namespace facebook::react {

RNCWebViewProps::RNCWebViewProps(
    const PropsParserContext &context,
    const RNCWebViewProps &sourceProps,
    const RawProps &rawProps): ViewProps(context, sourceProps, rawProps),

    allowFileAccess(convertRawProp(context, rawProps, "allowFileAccess", sourceProps.allowFileAccess, {false})),
    allowsProtectedMedia(convertRawProp(context, rawProps, "allowsProtectedMedia", sourceProps.allowsProtectedMedia, {false})),
    allowsFullscreenVideo(convertRawProp(context, rawProps, "allowsFullscreenVideo", sourceProps.allowsFullscreenVideo, {false})),
    androidLayerType(convertRawProp(context, rawProps, "androidLayerType", sourceProps.androidLayerType, {RNCWebViewAndroidLayerType::None})),
    cacheMode(convertRawProp(context, rawProps, "cacheMode", sourceProps.cacheMode, {RNCWebViewCacheMode::LOAD_DEFAULT})),
    domStorageEnabled(convertRawProp(context, rawProps, "domStorageEnabled", sourceProps.domStorageEnabled, {false})),
    downloadingMessage(convertRawProp(context, rawProps, "downloadingMessage", sourceProps.downloadingMessage, {})),
    forceDarkOn(convertRawProp(context, rawProps, "forceDarkOn", sourceProps.forceDarkOn, {false})),
    geolocationEnabled(convertRawProp(context, rawProps, "geolocationEnabled", sourceProps.geolocationEnabled, {false})),
    lackPermissionToDownloadMessage(convertRawProp(context, rawProps, "lackPermissionToDownloadMessage", sourceProps.lackPermissionToDownloadMessage, {})),
    messagingModuleName(convertRawProp(context, rawProps, "messagingModuleName", sourceProps.messagingModuleName, {})),
    minimumFontSize(convertRawProp(context, rawProps, "minimumFontSize", sourceProps.minimumFontSize, {0})),
    mixedContentMode(convertRawProp(context, rawProps, "mixedContentMode", sourceProps.mixedContentMode, {RNCWebViewMixedContentMode::Never})),
    nestedScrollEnabled(convertRawProp(context, rawProps, "nestedScrollEnabled", sourceProps.nestedScrollEnabled, {false})),
    overScrollMode(convertRawProp(context, rawProps, "overScrollMode", sourceProps.overScrollMode, {})),
    saveFormDataDisabled(convertRawProp(context, rawProps, "saveFormDataDisabled", sourceProps.saveFormDataDisabled, {false})),
    scalesPageToFit(convertRawProp(context, rawProps, "scalesPageToFit", sourceProps.scalesPageToFit, {false})),
    setBuiltInZoomControls(convertRawProp(context, rawProps, "setBuiltInZoomControls", sourceProps.setBuiltInZoomControls, {false})),
    setDisplayZoomControls(convertRawProp(context, rawProps, "setDisplayZoomControls", sourceProps.setDisplayZoomControls, {false})),
    setSupportMultipleWindows(convertRawProp(context, rawProps, "setSupportMultipleWindows", sourceProps.setSupportMultipleWindows, {false})),
    textZoom(convertRawProp(context, rawProps, "textZoom", sourceProps.textZoom, {0})),
    thirdPartyCookiesEnabled(convertRawProp(context, rawProps, "thirdPartyCookiesEnabled", sourceProps.thirdPartyCookiesEnabled, {false})),
    hasOnScroll(convertRawProp(context, rawProps, "hasOnScroll", sourceProps.hasOnScroll, {false})),
    allowingReadAccessToURL(convertRawProp(context, rawProps, "allowingReadAccessToURL", sourceProps.allowingReadAccessToURL, {})),
    allowsBackForwardNavigationGestures(convertRawProp(context, rawProps, "allowsBackForwardNavigationGestures", sourceProps.allowsBackForwardNavigationGestures, {false})),
    allowsInlineMediaPlayback(convertRawProp(context, rawProps, "allowsInlineMediaPlayback", sourceProps.allowsInlineMediaPlayback, {false})),
    allowsPictureInPictureMediaPlayback(convertRawProp(context, rawProps, "allowsPictureInPictureMediaPlayback", sourceProps.allowsPictureInPictureMediaPlayback, {false})),
    allowsAirPlayForMediaPlayback(convertRawProp(context, rawProps, "allowsAirPlayForMediaPlayback", sourceProps.allowsAirPlayForMediaPlayback, {false})),
    allowsLinkPreview(convertRawProp(context, rawProps, "allowsLinkPreview", sourceProps.allowsLinkPreview, {false})),
    automaticallyAdjustContentInsets(convertRawProp(context, rawProps, "automaticallyAdjustContentInsets", sourceProps.automaticallyAdjustContentInsets, {false})),
    autoManageStatusBarEnabled(convertRawProp(context, rawProps, "autoManageStatusBarEnabled", sourceProps.autoManageStatusBarEnabled, {false})),
    bounces(convertRawProp(context, rawProps, "bounces", sourceProps.bounces, {false})),
    contentInset(convertRawProp(context, rawProps, "contentInset", sourceProps.contentInset, {})),
    contentInsetAdjustmentBehavior(convertRawProp(context, rawProps, "contentInsetAdjustmentBehavior", sourceProps.contentInsetAdjustmentBehavior, {RNCWebViewContentInsetAdjustmentBehavior::Never})),
    contentMode(convertRawProp(context, rawProps, "contentMode", sourceProps.contentMode, {RNCWebViewContentMode::Recommended})),
    dataDetectorTypes(convertRawProp(context, rawProps, "dataDetectorTypes", RNCWebViewDataDetectorTypesMaskWrapped{ .value = sourceProps.dataDetectorTypes }, {static_cast<RNCWebViewDataDetectorTypesMask>(RNCWebViewDataDetectorTypes::PhoneNumber)}).value),
    decelerationRate(convertRawProp(context, rawProps, "decelerationRate", sourceProps.decelerationRate, {0.0})),
    directionalLockEnabled(convertRawProp(context, rawProps, "directionalLockEnabled", sourceProps.directionalLockEnabled, {false})),
    enableApplePay(convertRawProp(context, rawProps, "enableApplePay", sourceProps.enableApplePay, {false})),
    hideKeyboardAccessoryView(convertRawProp(context, rawProps, "hideKeyboardAccessoryView", sourceProps.hideKeyboardAccessoryView, {false})),
    keyboardDisplayRequiresUserAction(convertRawProp(context, rawProps, "keyboardDisplayRequiresUserAction", sourceProps.keyboardDisplayRequiresUserAction, {false})),
    limitsNavigationsToAppBoundDomains(convertRawProp(context, rawProps, "limitsNavigationsToAppBoundDomains", sourceProps.limitsNavigationsToAppBoundDomains, {false})),
    mediaCapturePermissionGrantType(convertRawProp(context, rawProps, "mediaCapturePermissionGrantType", sourceProps.mediaCapturePermissionGrantType, {RNCWebViewMediaCapturePermissionGrantType::Prompt})),
    pagingEnabled(convertRawProp(context, rawProps, "pagingEnabled", sourceProps.pagingEnabled, {false})),
    pullToRefreshEnabled(convertRawProp(context, rawProps, "pullToRefreshEnabled", sourceProps.pullToRefreshEnabled, {false})),
    refreshControlLightMode(convertRawProp(context, rawProps, "refreshControlLightMode", sourceProps.refreshControlLightMode, {false})),
    scrollEnabled(convertRawProp(context, rawProps, "scrollEnabled", sourceProps.scrollEnabled, {false})),
    sharedCookiesEnabled(convertRawProp(context, rawProps, "sharedCookiesEnabled", sourceProps.sharedCookiesEnabled, {false})),
    textInteractionEnabled(convertRawProp(context, rawProps, "textInteractionEnabled", sourceProps.textInteractionEnabled, {false})),
    useSharedProcessPool(convertRawProp(context, rawProps, "useSharedProcessPool", sourceProps.useSharedProcessPool, {false})),
    menuItems(convertRawProp(context, rawProps, "menuItems", sourceProps.menuItems, {})),
    suppressMenuItems(convertRawProp(context, rawProps, "suppressMenuItems", sourceProps.suppressMenuItems, {})),
    hasOnFileDownload(convertRawProp(context, rawProps, "hasOnFileDownload", sourceProps.hasOnFileDownload, {false})),
    fraudulentWebsiteWarningEnabled(convertRawProp(context, rawProps, "fraudulentWebsiteWarningEnabled", sourceProps.fraudulentWebsiteWarningEnabled, {false})),
    allowFileAccessFromFileURLs(convertRawProp(context, rawProps, "allowFileAccessFromFileURLs", sourceProps.allowFileAccessFromFileURLs, {false})),
    allowUniversalAccessFromFileURLs(convertRawProp(context, rawProps, "allowUniversalAccessFromFileURLs", sourceProps.allowUniversalAccessFromFileURLs, {false})),
    applicationNameForUserAgent(convertRawProp(context, rawProps, "applicationNameForUserAgent", sourceProps.applicationNameForUserAgent, {})),
    basicAuthCredential(convertRawProp(context, rawProps, "basicAuthCredential", sourceProps.basicAuthCredential, {})),
    cacheEnabled(convertRawProp(context, rawProps, "cacheEnabled", sourceProps.cacheEnabled, {false})),
    incognito(convertRawProp(context, rawProps, "incognito", sourceProps.incognito, {false})),
    injectedJavaScript(convertRawProp(context, rawProps, "injectedJavaScript", sourceProps.injectedJavaScript, {})),
    injectedJavaScriptBeforeContentLoaded(convertRawProp(context, rawProps, "injectedJavaScriptBeforeContentLoaded", sourceProps.injectedJavaScriptBeforeContentLoaded, {})),
    injectedJavaScriptForMainFrameOnly(convertRawProp(context, rawProps, "injectedJavaScriptForMainFrameOnly", sourceProps.injectedJavaScriptForMainFrameOnly, {false})),
    injectedJavaScriptBeforeContentLoadedForMainFrameOnly(convertRawProp(context, rawProps, "injectedJavaScriptBeforeContentLoadedForMainFrameOnly", sourceProps.injectedJavaScriptBeforeContentLoadedForMainFrameOnly, {false})),
    javaScriptCanOpenWindowsAutomatically(convertRawProp(context, rawProps, "javaScriptCanOpenWindowsAutomatically", sourceProps.javaScriptCanOpenWindowsAutomatically, {false})),
    javaScriptEnabled(convertRawProp(context, rawProps, "javaScriptEnabled", sourceProps.javaScriptEnabled, {false})),
    webviewDebuggingEnabled(convertRawProp(context, rawProps, "webviewDebuggingEnabled", sourceProps.webviewDebuggingEnabled, {false})),
    mediaPlaybackRequiresUserAction(convertRawProp(context, rawProps, "mediaPlaybackRequiresUserAction", sourceProps.mediaPlaybackRequiresUserAction, {false})),
    messagingEnabled(convertRawProp(context, rawProps, "messagingEnabled", sourceProps.messagingEnabled, {false})),
    hasOnOpenWindowEvent(convertRawProp(context, rawProps, "hasOnOpenWindowEvent", sourceProps.hasOnOpenWindowEvent, {false})),
    showsHorizontalScrollIndicator(convertRawProp(context, rawProps, "showsHorizontalScrollIndicator", sourceProps.showsHorizontalScrollIndicator, {false})),
    showsVerticalScrollIndicator(convertRawProp(context, rawProps, "showsVerticalScrollIndicator", sourceProps.showsVerticalScrollIndicator, {false})),
    newSource(convertRawProp(context, rawProps, "newSource", sourceProps.newSource, {})),
    userAgent(convertRawProp(context, rawProps, "userAgent", sourceProps.userAgent, {})),
    injectedJavaScriptObject(convertRawProp(context, rawProps, "injectedJavaScriptObject", sourceProps.injectedJavaScriptObject, {}))
      {}

} // namespace facebook::react
