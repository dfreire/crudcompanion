import * as React from 'react';
import * as page from 'page';

interface LinkProps {
    text: string;
    path: string;
}

export function Link(props: LinkProps) {
    const onClick = (evt: React.MouseEvent<any>) => {
        evt.preventDefault();
        evt.stopPropagation();
        console.log('Link ' + props.path);
        page(props.path);
    };

    return (
        <a onClick={onClick}>{props.text}</a>
    );
}

export function navigateTo(path: string) {
    console.log('navigateTo ' + path);
    page(path);
}