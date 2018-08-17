import {Utils as _} from "../utils";
import {Autowired, Bean} from "../context/context";
import {GridOptionsWrapper} from "../gridOptionsWrapper";
import {IFrameworkFactory} from "../interfaces/iFrameworkFactory";

@Bean('resizeObserverService')
export class ResizeObserverService {

    @Autowired('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;
    @Autowired('frameworkFactory') private frameworkFactory: IFrameworkFactory;

    public observeResize(element: HTMLElement, callback: ()=>void ): ()=>void {

        if ((<any>window).ResizeObserver) {
            return useBrowserResizeObserver();
        } else {
            return usePolyfill();
        }

        // put in variable, so available to usePolyfill() function below
        let frameworkFactory = this.frameworkFactory;

        function useBrowserResizeObserver(): ()=>void {
            const resizeObserver = new (<any>window).ResizeObserver(callback);
            resizeObserver.observe(element);
            return ()=> resizeObserver.disconnect();
        }

        function usePolyfill(): ()=>void {

            // initialise to the current width and height, so first call will have no changes
            let widthLastTime = _.offsetWidth(element);
            let heightLastTime = _.offsetHeight(element);

            // when finished, this gets turned to false.
            let running = true;

            periodicallyCheckWidthAndHeight();

            function periodicallyCheckWidthAndHeight() {
                if (running) {

                    let newWidth = _.offsetWidth(element);
                    let newHeight = _.offsetHeight(element);

                    let changed = newWidth !== widthLastTime || newHeight !== heightLastTime;
                    if (changed) {
                        widthLastTime = newWidth;
                        heightLastTime = newHeight;
                        callback();
                    }

                    frameworkFactory.setTimeout(periodicallyCheckWidthAndHeight, 500);
                }
            }

            // the callback function we return sets running to false
            return ()=> running = false;
        }
    }

}
