import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import cropper from 'cropperjs';
import { Subject, timer } from 'rxjs';
import { debounceTime, filter, takeUntil, withLatestFrom } from 'rxjs/operators';
declare const Cropper: any;
@Component({
    selector: 'image-ui',
    templateUrl: './image-ui.component.html',
    styles: [`
    .container{
        padding:0px;
        min-height:10px;
        max-height: 350px;
        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 5px 8px 0 rgba(0,0,0,.14), 0 1px 14px 0 rgba(0,0,0,.12);

    }
    .img-drag-tip{
        display: flex;
        position: absolute;
        color: #fff;
        z-index: 1;
        top: 45%;
        left: 37%;
        background: #444343b3;
        border: 1px solid;
        padding: 2px 5px;
        border-radius: 3px;
    }

    #info-tip:before{
        font-weight: 600;
    }


    .crop-preview-text{
        margin-top: -19px;
        position: absolute;
        margin-left: 25%;
        background: #2229387a;
        color: #fff;
        padding: 0 5px;
        font-size: 12px;
        border: 1px solid #4799ea;
        opacity: 0.8;
    }
    #crop-preview-wrap:hover .crop-preview-text{
        opacity: 1;
    }


    `]
})
export class ImageUiComponent implements AfterViewInit, OnDestroy {

    private toDestroy$ = new Subject<void>();
    @ViewChild('container', { static: true }) editorContainer: ElementRef<HTMLElement>;
    @Output() onImageCropped = new EventEmitter<Blob>();

    fileErrorMessage: string;
    selectedFile: File;
    dragTip: boolean;

    // file format flag
    private readonly fileFormat = ['jpg', 'jpeg', 'png', 'bmp'];
    // an instance of cropper
    cropper: cropper;
    // form data file
    profilePicture: Blob;
    // preview base64 data:image
    cropped: string;
    private crop = new Subject();


    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    ngAfterViewInit() {
        this.crop.pipe(
            debounceTime(700),
            withLatestFrom(),
            // checks (undefined | null)
            filter(_ => this.cropper && this.selectedFile && !this.fileErrorMessage ? true : false),
            takeUntil(this.toDestroy$),
        ).subscribe(_ => {
            this.cdr.markForCheck();
            const canv = this.cropper.getCroppedCanvas();
            // set preview
            this.cropped = canv && canv.toDataURL('image/jpeg', 0.70);

            // set form data as a Blob
            this.cropper.getCroppedCanvas().toBlob(blob => {
                this.profilePicture = blob;
                this.onImageCropped.emit(blob);
            }, this.selectedFile.type, 0.65);


        });
    }

    imageSelected(fe: any) {

        const container = this.editorContainer.nativeElement;
        if (!container) {
            this.fileErrorMessage = 'Crop container not found.';
            return;
        }

        // cleanup before process
        this.imageRemoved();

        if (!fe) { return; }

        const file = fe.target.files[0] as File || fe.srcElement.files[0] as File;
        if (!file) { return; }

        const invalidFormat = this.validateFileFormat(file);
        if (invalidFormat) { return; }

        const maxSize = this.validateFileSize(file);

        if (maxSize) { return; }

        this.selectedFile = file;

        const reader = new FileReader();

        // Read the contents of Image File.
        reader.readAsDataURL(file);

        // instantiate cropperjs
        reader.onload = (e: any, ) => {

            const image = document.createElement('img');
            image.style.width = '100%';

            // Set the Base64 string return from FileReader as source.
            image.src = e.target.result;
            // cleanup
            container.innerHTML = null;

            container.appendChild(image);

            // init cropper
            this.initCropperOnImageLoaded(image, container);

            timer(1000).pipe(takeUntil(this.toDestroy$)).subscribe(() => {
                container.scrollIntoView({ behavior: 'smooth' });

                // cleanup
                container.removeChild(image);
            });
        };
    }

    imageRemoved() {

        if (this.cropper) {
            this.cropper.clear();
            this.cropper.reset();
            this.cropper.destroy();
        }

        this.fileErrorMessage = null;
        this.cropper = null;
        this.dragTip = null;
        this.cropped = null;
        this.profilePicture = null;
        this.selectedFile = null;
        this.editorContainer.nativeElement.innerHTML = null;

    }

    private validateFileFormat(file: File) {
        // a valid file extension must be provided
        const ext = file.name.slice((file.name.lastIndexOf('.') - 1) + 2);
        const format = this.fileFormat.indexOf(ext.toLowerCase());
        if (format <= -1) {
            this.fileErrorMessage = 'Invalid file format. Supported file formats are ' + this.fileFormat.join(', ');
        }

        return format <= -1;
    }

    private validateFileSize(file: File) {
        // max file size is 20mb to process using cropperjs
        const isMax = file.size > 20480000;
        if (isMax) {
            this.fileErrorMessage = 'File size limit exceed. Max file size is 20MB';
        }

        return isMax;
    }

    private initCropperOnImageLoaded(image: HTMLImageElement, container: HTMLElement) {

        const options: Cropper.Options = {
            viewMode: 1,
            aspectRatio: 1,
            // crop: (event) => {
            //     const c = cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.70);
            //     this.cropped = c;
            //     // cropper.getCroppedCanvas().toBlob(d => {
            //     //     console.log(d);

            //     // }, 'image/jpg', 0.90);
            //     // console.log(c);
            // },
            crop: e => this.crop.next(e),
            cropmove: () => this.dragTip = true,
            autoCropArea: 0,
            guides: false,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: false,
            center: true,
            responsive: true,
            zoomable: true,
            toggleDragModeOnDblclick: false,
            background: true,
            minCropBoxHeight: 200,
            minCropBoxWidth: 200,
            scalable: false

        };
        const crop = new Cropper(image, options);
        crop.setCropBoxData({ width: 400, height: 400 });
        crop.setDragMode('move' as any);

        this.cropper = crop;
    }


    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
