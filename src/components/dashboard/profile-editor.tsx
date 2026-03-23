"use client";

import { ProfileHeaderEditor } from "./profile-header-editor";
import { LinkListEditor } from "./link-list-editor";
import { SocialEditor } from "./social-editor";
import { ThemeEditor } from "./theme-editor";
import { DecoratorEditor } from "./decorator-editor";
import type { useProfileData } from "@/hooks/use-profile-data";

type ProfileActions = ReturnType<typeof useProfileData>;

export function ProfileEditor(props: ProfileActions) {
  return (
    <div className="flex flex-col gap-8 overflow-y-auto p-6">
      <ProfileHeaderEditor
        profileData={props.profileData}
        updateProfile={props.updateProfile}
        headerLayout={props.profileData.headerLayout}
        setHeaderLayout={props.setHeaderLayout}
      />

      <hr className="border-border" />

      <LinkListEditor
        links={props.profileData.links}
        linkLayout={props.profileData.linkLayout}
        linkStyle={props.profileData.linkStyle}
        linkRound={props.profileData.linkRound}
        linkAnimation={props.profileData.linkAnimation}
        linkGradientFrom={props.profileData.linkGradientFrom}
        linkGradientTo={props.profileData.linkGradientTo}
        addLink={props.addLink}
        updateLink={props.updateLink}
        removeLink={props.removeLink}
        toggleLink={props.toggleLink}
        reorderLinks={props.reorderLinks}
        setLinkLayout={props.setLinkLayout}
        setLinkStyle={props.setLinkStyle}
        setLinkRound={props.setLinkRound}
        setLinkAnimation={props.setLinkAnimation}
        setLinkGradient={props.setLinkGradient}
      />

      <hr className="border-border" />

      <SocialEditor
        socials={props.profileData.socials}
        addSocial={props.addSocial}
        updateSocial={props.updateSocial}
        removeSocial={props.removeSocial}
        reorderSocials={props.reorderSocials}
      />

      <hr className="border-border" />

      <DecoratorEditor
        decorator1Type={props.profileData.decorator1Type}
        decorator1Text={props.profileData.decorator1Text}
        decorator2Type={props.profileData.decorator2Type}
        decorator2Text={props.profileData.decorator2Text}
        setDecorator1={props.setDecorator1}
        setDecorator1Text={props.setDecorator1Text}
        setDecorator2={props.setDecorator2}
        setDecorator2Text={props.setDecorator2Text}
      />

      <hr className="border-border" />

      <ThemeEditor
        pageLayout={props.profileData.pageLayout}
        colorTheme={props.profileData.colorTheme}
        darkMode={props.profileData.darkMode}
        backgroundColor={props.profileData.backgroundColor}
        fontColor={props.profileData.fontColor}
        backgroundTexture={props.profileData.backgroundTexture}
        customPrimaryColor={props.profileData.customPrimaryColor}
        customSecondaryColor={props.profileData.customSecondaryColor}
        fontFamily={props.profileData.fontFamily}
        setPageLayout={props.setPageLayout}
        setColorTheme={props.setColorTheme}
        setDarkMode={props.setDarkMode}
        setBackgroundColor={props.setBackgroundColor}
        setFontColor={props.setFontColor}
        setBackgroundTexture={props.setBackgroundTexture}
        setCustomColors={props.setCustomColors}
        setFontFamily={props.setFontFamily}
      />

    </div>
  );
}
