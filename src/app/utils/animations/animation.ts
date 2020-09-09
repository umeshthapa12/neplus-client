import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const fadeInOutStagger = trigger('fadeInOutStagger', [
    transition('* <=> *', [
        query(':leave', [
            stagger('100ms', [
                animate('0.1s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0, height: '0' }))
            ]),

        ], { optional: true, }),
        query(':enter', [
            style({ opacity: 0, transform: 'translate(0, -10px)' }),
            stagger('100ms', [
                animate('0.2s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translate(0, 0)', height: '*' })),
            ])
        ], { optional: true }),
    ])
]);

export const collectionInOut = trigger('collectionInOut', [
    transition('* <=> *', [
        query(':leave', [
            stagger('10ms', [
                animate('0.1s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0, transform: 'translate(0, 20px)' }))
            ]),

        ], { optional: true }),
        query(':enter', [
            style({ opacity: 0, transform: 'translate(0, 20px)' }),
            stagger('50ms', [
                animate('0.4s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translate(0, 0)' })),
            ])
        ], { optional: true, limit: 50 }),
    ])
]);

export const fadeIn = trigger('fadeIn', [
    transition('* <=> *', [
        query(':leave ', [
            stagger('100ms', [
                animate('0.2s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0, height: '0', transform: 'translate(0, 10px)' }))
            ]),

        ], { optional: true }),
        query(':enter ', [
            style({ opacity: 0, transform: 'translate(0, -10px)' }),
            stagger('200ms', [
                animate('0.3s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translate(0, 0)', height: '*' })),
            ])
        ], { optional: true }),
    ])
]);

export const fadeInOutDownRoute = trigger('fadeInOutDownRoute', [

    transition('* => *', [
        query(':enter', [
            style({
                opacity: 0,
                width: 'calc(100% - 50px)',
                position: 'absolute',
                display: 'inline-block',
                transform: 'translateY(15px)',

            }),
        ], { optional: true }),

        query(':leave', [
            style({
                opacity: 1,
                transform: 'translateY(0)',
                width: 'calc(100% - 50px)',
            }),
            animate('0.4s ease-out', style({
                opacity: 0,
                position: 'absolute',
                display: 'inline-block',
                transform: 'translateY(15px)',

            }
            ))
        ], { optional: true }),

        query(':enter', [
            style({
                opacity: 0,
                display: 'inline-block',
                transform: 'translateY(15px)',
            }),
            animate('0.4s ease-in', style({
                width: 'calc(100% - 50px)',
                opacity: 1,
                transform: 'translateY(0)',

            }))
        ], { optional: true })
    ])
]);

export const faeInOut = trigger('faeInOut', [

    transition('* => *', [
        query(':enter', [
            style({
                opacity: 0,
                position: 'relative',
                display: 'block',
                overflow: 'hidden',
                transform: 'translateY(15px)',
            }),
        ], { optional: true }),

        query(':leave', [
            style({
                opacity: 1,
                transform: 'translateY(0)',
            }),
            stagger('500ms reverse', [
                animate('0.2s cubic-bezier(.09,.53,.39,1.04)', style({
                    opacity: 0,
                    display: 'block',
                    overflow: 'hidden',
                    transform: 'translateY(15px)',
                }
                ))
            ])
        ], { optional: true }),

        query(':enter', [
            style({
                opacity: 0,
                display: 'block',
                overflow: 'hidden',
                transform: 'translateY(15px)',
            }),
            stagger('500ms', [
                animate('0.2s cubic-bezier(.09,.53,.39,1.04)', style({
                    opacity: 1,
                    transform: 'translateY(0)',
                }))
            ])
        ], { optional: true })
    ])
]);
