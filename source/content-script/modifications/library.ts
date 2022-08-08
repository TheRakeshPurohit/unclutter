import { addArticleToLibrary, checkArticleInLibrary } from "../../common/api";
import { LibraryState } from "../../common/schema";
import { getLibraryUser } from "../../common/storage";
import OverlayManager from "./overlay";
import { PageModifier, trackModifierExecution } from "./_interface";

@trackModifierExecution
export default class LibraryModifier implements PageModifier {
    private articleUrl: string;
    private overlayManager: OverlayManager;
    private readingProgressSyncIntervalSeconds = 10;

    libraryState: LibraryState = {
        isClustering: false,
        wasAlreadyPresent: false,
        error: false,
    };

    constructor(articleUrl: string, overlayManager: OverlayManager) {
        this.articleUrl = articleUrl;
        this.overlayManager = overlayManager;
    }

    async fetchArticleState() {
        this.libraryState.libraryUser = await getLibraryUser();
        this.overlayManager.updateLibraryState(this.libraryState);

        this.libraryState.libraryInfo = await checkArticleInLibrary(
            this.articleUrl,
            this.libraryState.libraryUser
        );

        if (!this.libraryState.libraryInfo) {
            this.libraryState.isClustering = true;
            this.overlayManager.updateLibraryState(this.libraryState);

            this.libraryState.libraryInfo = await addArticleToLibrary(
                this.articleUrl,
                this.libraryState.libraryUser
            );
            this.overlayManager.updateLibraryState(this.libraryState);
        } else {
            this.libraryState.wasAlreadyPresent = true;
            this.overlayManager.updateLibraryState(this.libraryState);
        }
    }

    handleScrollUpdate(readingProgress: number) {
        if (!this.libraryState.libraryUser) {
            return;
        }
        console.log(readingProgress);
    }

    startReadingProgressSync() {
        window.addEventListener("beforeunload", () => {
            console.log("beforeunload");
        });
    }
}
