function Counter() {
    const [count, setCount] = React.useState(5);
    const increment = (e) => {
        setCount(count + 1);
    };

    return (
        <button
            type="button"
            onClick={() => {
                increment();
            }}
        >
            clicker React count {count}, click me!
        </button>
    );
}

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
        };
        this.increment = this.increment.bind(this);
    }
    increment(e) {
        $adaptive
            .if('tablet', function () {
                console.log('Clicked on Tablet!');
            })
            .onlyOnce();

        this.setState((prevState, props) => ({
            count: prevState.count + 1,
        }));
    }
    render() {
        return (
            <button type="button" onClick={this.increment}>
                clicker React count {this.state.count}, click me when it Tablet size and watch the console output!
            </button>
        );
    }
}

function Hello(props) {
    return (
        <div>
            <h4>React component</h4>
            <p>This component will move at tablet to static hello {props.hello}</p>
            <div
                data-adaptive="addClass.tablet(laura, miau) &&
        addClass.mobile|fullscreen(red, green) && 
        addClass.desktop(uno, dos)"
            >
                This is inside the react component
            </div>
            <Counter />
            {/* One time Teleport */}
            <teleport-to target="#hello" position="after">
                <div style={{ padding: '8px', background: 'violet' }}>
                    Teleporting an element from inside <b>react</b> component
                </div>
            </teleport-to>
            {/* conditional teleport with adaptive */}
            <div data-adaptive="teleport.desktop|mobile.before(#hello)" style={{ background: 'beige' }}>
                Teleporting on desktop or mobile
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('reactHello'));
root.render(<Hello hello="component" />);

const other = ReactDOM.createRoot(document.getElementById('reactButton'));
other.render(<Button />);
