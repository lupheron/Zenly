'use client'

import MainContainer from "@/src/components/Containers/MainContainer"
import React, { Suspense } from "react"
import PostsSection from "./postscontainer/PostsSection"
import { useLanguage } from "@/src/contexts/LanguageContext"

const PostsPage = () => {
    const { t } = useLanguage()

    return (
        <MainContainer>
            <Suspense fallback={<div className="p-4 text-center">{t('common.loading')}</div>}>
                <PostsSection />
            </Suspense>
        </MainContainer>
    )
}

export default PostsPage
