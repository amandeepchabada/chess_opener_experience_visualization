
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const gameDataStore = writable(false); //game_data_1M; // change if more data is needed

    const initial_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    //export const test_fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
    const curr_fen = writable(initial_fen); // TODO: ensure initial_fen is used at some point in the future

    const selectedSquare = writable(false);  // false when nothing selected
    const colorByPieceStore = writable(false);  // for selecting the colorscheme in future moves

    const test_fenData = [
        {"b": 105023, "w": 115498, "t": 42, "nxt": {"e7e6": 1, "g8f6": 1 }},  // beginner
        {"b": 15, "w": 115498, "t": 9263, "nxt": {"e7e6": 1, "g8f6": 1, "f7f5": 9, "b8a6": 1, "d8e7": 2 }}, // intermediate
        {"b": 105023, "w": 984984, "t": 66, "nxt": {"e7e6": 1, "g8f6": 1 }},  // advanced
        {"b": 0, "w": 115498, "t": 9263, "nxt": {"e7e6": 1, "g8f6": 1 }},  // pro
    ];

    const fenDataStore = derived(  // array of level objects
        [curr_fen, gameDataStore], 
        ([$curr_fen, $gameDataStore]) => {
            if (!$gameDataStore) return test_fenData
            console.log('setting new fen', $curr_fen, $gameDataStore);
            const vals = ['0', '1', '2', '3'].map(i => {  // loop over 4 levels
                if ($gameDataStore[i][$curr_fen] == undefined) {
                    //window.alert(`New fen not recognized for ${i}: ` + $curr_fen);  // throw user visible error
                    return [];
                }
                return $gameDataStore[i][$curr_fen]  // grab data for level
            });
            console.log('new fenDataStore vals',{vals});
            return vals
        },
        test_fenData  // initial value
    );

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*
     * Copyright (c) 2020, Jeff Hlywa (jhlywa@gmail.com)
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice,
     *    this list of conditions and the following disclaimer.
     * 2. Redistributions in binary form must reproduce the above copyright notice,
     *    this list of conditions and the following disclaimer in the documentation
     *    and/or other materials provided with the distribution.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
     * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     * POSSIBILITY OF SUCH DAMAGE.
     *
     *----------------------------------------------------------------------------*/

    var chess = createCommonjsModule(function (module, exports) {
    /* minified license below  */

    /* @license
     * Copyright (c) 2018, Jeff Hlywa (jhlywa@gmail.com)
     * Released under the BSD license
     * https://github.com/jhlywa/chess.js/blob/master/LICENSE
     */

    var Chess = function(fen) {
      var BLACK = 'b';
      var WHITE = 'w';

      var EMPTY = -1;

      var PAWN = 'p';
      var KNIGHT = 'n';
      var BISHOP = 'b';
      var ROOK = 'r';
      var QUEEN = 'q';
      var KING = 'k';

      var SYMBOLS = 'pnbrqkPNBRQK';

      var DEFAULT_POSITION =
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

      var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];

      var PAWN_OFFSETS = {
        b: [16, 32, 17, 15],
        w: [-16, -32, -17, -15]
      };

      var PIECE_OFFSETS = {
        n: [-18, -33, -31, -14, 18, 33, 31, 14],
        b: [-17, -15, 17, 15],
        r: [-16, 1, 16, -1],
        q: [-17, -16, -15, 1, 17, 16, 15, -1],
        k: [-17, -16, -15, 1, 17, 16, 15, -1]
      };

      // prettier-ignore
      var ATTACKS = [
        20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
         0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
         0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
         0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
         0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
         0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
         0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
        24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
         0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
         0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
         0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
         0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
         0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
         0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
        20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
      ];

      // prettier-ignore
      var RAYS = [
         17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
          0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
          0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
          0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
          0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
          0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
          0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
          1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
          0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
          0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
          0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
          0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
          0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
          0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
        -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
      ];

      var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

      var FLAGS = {
        NORMAL: 'n',
        CAPTURE: 'c',
        BIG_PAWN: 'b',
        EP_CAPTURE: 'e',
        PROMOTION: 'p',
        KSIDE_CASTLE: 'k',
        QSIDE_CASTLE: 'q'
      };

      var BITS = {
        NORMAL: 1,
        CAPTURE: 2,
        BIG_PAWN: 4,
        EP_CAPTURE: 8,
        PROMOTION: 16,
        KSIDE_CASTLE: 32,
        QSIDE_CASTLE: 64
      };

      var RANK_1 = 7;
      var RANK_2 = 6;
      var RANK_7 = 1;
      var RANK_8 = 0;

      // prettier-ignore
      var SQUARES = {
        a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
        a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
        a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
        a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
        a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
        a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
        a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
        a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
      };

      var ROOKS = {
        w: [
          { square: SQUARES.a1, flag: BITS.QSIDE_CASTLE },
          { square: SQUARES.h1, flag: BITS.KSIDE_CASTLE }
        ],
        b: [
          { square: SQUARES.a8, flag: BITS.QSIDE_CASTLE },
          { square: SQUARES.h8, flag: BITS.KSIDE_CASTLE }
        ]
      };

      var board = new Array(128);
      var kings = { w: EMPTY, b: EMPTY };
      var turn = WHITE;
      var castling = { w: 0, b: 0 };
      var ep_square = EMPTY;
      var half_moves = 0;
      var move_number = 1;
      var history = [];
      var header = {};

      /* if the user passes in a fen string, load it, else default to
       * starting position
       */
      if (typeof fen === 'undefined') {
        load(DEFAULT_POSITION);
      } else {
        load(fen);
      }

      function clear(keep_headers) {
        if (typeof keep_headers === 'undefined') {
          keep_headers = false;
        }

        board = new Array(128);
        kings = { w: EMPTY, b: EMPTY };
        turn = WHITE;
        castling = { w: 0, b: 0 };
        ep_square = EMPTY;
        half_moves = 0;
        move_number = 1;
        history = [];
        if (!keep_headers) header = {};
        update_setup(generate_fen());
      }

      function reset() {
        load(DEFAULT_POSITION);
      }

      function load(fen, keep_headers) {
        if (typeof keep_headers === 'undefined') {
          keep_headers = false;
        }

        var tokens = fen.split(/\s+/);
        var position = tokens[0];
        var square = 0;

        if (!validate_fen(fen).valid) {
          return false
        }

        clear(keep_headers);

        for (var i = 0; i < position.length; i++) {
          var piece = position.charAt(i);

          if (piece === '/') {
            square += 8;
          } else if (is_digit(piece)) {
            square += parseInt(piece, 10);
          } else {
            var color = piece < 'a' ? WHITE : BLACK;
            put({ type: piece.toLowerCase(), color: color }, algebraic(square));
            square++;
          }
        }

        turn = tokens[1];

        if (tokens[2].indexOf('K') > -1) {
          castling.w |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf('Q') > -1) {
          castling.w |= BITS.QSIDE_CASTLE;
        }
        if (tokens[2].indexOf('k') > -1) {
          castling.b |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf('q') > -1) {
          castling.b |= BITS.QSIDE_CASTLE;
        }

        ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]];
        half_moves = parseInt(tokens[4], 10);
        move_number = parseInt(tokens[5], 10);

        update_setup(generate_fen());

        return true
      }

      /* TODO: this function is pretty much crap - it validates structure but
       * completely ignores content (e.g. doesn't verify that each side has a king)
       * ... we should rewrite this, and ditch the silly error_number field while
       * we're at it
       */
      function validate_fen(fen) {
        var errors = {
          0: 'No errors.',
          1: 'FEN string must contain six space-delimited fields.',
          2: '6th field (move number) must be a positive integer.',
          3: '5th field (half move counter) must be a non-negative integer.',
          4: '4th field (en-passant square) is invalid.',
          5: '3rd field (castling availability) is invalid.',
          6: '2nd field (side to move) is invalid.',
          7: "1st field (piece positions) does not contain 8 '/'-delimited rows.",
          8: '1st field (piece positions) is invalid [consecutive numbers].',
          9: '1st field (piece positions) is invalid [invalid piece].',
          10: '1st field (piece positions) is invalid [row too large].',
          11: 'Illegal en-passant square'
        };

        /* 1st criterion: 6 space-seperated fields? */
        var tokens = fen.split(/\s+/);
        if (tokens.length !== 6) {
          return { valid: false, error_number: 1, error: errors[1] }
        }

        /* 2nd criterion: move number field is a integer value > 0? */
        if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) {
          return { valid: false, error_number: 2, error: errors[2] }
        }

        /* 3rd criterion: half move counter is an integer >= 0? */
        if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) {
          return { valid: false, error_number: 3, error: errors[3] }
        }

        /* 4th criterion: 4th field is a valid e.p.-string? */
        if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
          return { valid: false, error_number: 4, error: errors[4] }
        }

        /* 5th criterion: 3th field is a valid castle-string? */
        if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
          return { valid: false, error_number: 5, error: errors[5] }
        }

        /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
        if (!/^(w|b)$/.test(tokens[1])) {
          return { valid: false, error_number: 6, error: errors[6] }
        }

        /* 7th criterion: 1st field contains 8 rows? */
        var rows = tokens[0].split('/');
        if (rows.length !== 8) {
          return { valid: false, error_number: 7, error: errors[7] }
        }

        /* 8th criterion: every row is valid? */
        for (var i = 0; i < rows.length; i++) {
          /* check for right sum of fields AND not two numbers in succession */
          var sum_fields = 0;
          var previous_was_number = false;

          for (var k = 0; k < rows[i].length; k++) {
            if (!isNaN(rows[i][k])) {
              if (previous_was_number) {
                return { valid: false, error_number: 8, error: errors[8] }
              }
              sum_fields += parseInt(rows[i][k], 10);
              previous_was_number = true;
            } else {
              if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                return { valid: false, error_number: 9, error: errors[9] }
              }
              sum_fields += 1;
              previous_was_number = false;
            }
          }
          if (sum_fields !== 8) {
            return { valid: false, error_number: 10, error: errors[10] }
          }
        }

        if (
          (tokens[3][1] == '3' && tokens[1] == 'w') ||
          (tokens[3][1] == '6' && tokens[1] == 'b')
        ) {
          return { valid: false, error_number: 11, error: errors[11] }
        }

        /* everything's okay! */
        return { valid: true, error_number: 0, error: errors[0] }
      }

      function generate_fen() {
        var empty = 0;
        var fen = '';

        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          if (board[i] == null) {
            empty++;
          } else {
            if (empty > 0) {
              fen += empty;
              empty = 0;
            }
            var color = board[i].color;
            var piece = board[i].type;

            fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
          }

          if ((i + 1) & 0x88) {
            if (empty > 0) {
              fen += empty;
            }

            if (i !== SQUARES.h1) {
              fen += '/';
            }

            empty = 0;
            i += 8;
          }
        }

        var cflags = '';
        if (castling[WHITE] & BITS.KSIDE_CASTLE) {
          cflags += 'K';
        }
        if (castling[WHITE] & BITS.QSIDE_CASTLE) {
          cflags += 'Q';
        }
        if (castling[BLACK] & BITS.KSIDE_CASTLE) {
          cflags += 'k';
        }
        if (castling[BLACK] & BITS.QSIDE_CASTLE) {
          cflags += 'q';
        }

        /* do we have an empty castling flag? */
        cflags = cflags || '-';
        var epflags = ep_square === EMPTY ? '-' : algebraic(ep_square);

        return [fen, turn, cflags, epflags, half_moves, move_number].join(' ')
      }

      function set_header(args) {
        for (var i = 0; i < args.length; i += 2) {
          if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
            header[args[i]] = args[i + 1];
          }
        }
        return header
      }

      /* called when the initial board setup is changed with put() or remove().
       * modifies the SetUp and FEN properties of the header object.  if the FEN is
       * equal to the default position, the SetUp and FEN are deleted
       * the setup is only updated if history.length is zero, ie moves haven't been
       * made.
       */
      function update_setup(fen) {
        if (history.length > 0) return

        if (fen !== DEFAULT_POSITION) {
          header['SetUp'] = '1';
          header['FEN'] = fen;
        } else {
          delete header['SetUp'];
          delete header['FEN'];
        }
      }

      function get(square) {
        var piece = board[SQUARES[square]];
        return piece ? { type: piece.type, color: piece.color } : null
      }

      function put(piece, square) {
        /* check for valid piece object */
        if (!('type' in piece && 'color' in piece)) {
          return false
        }

        /* check for piece */
        if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
          return false
        }

        /* check for valid square */
        if (!(square in SQUARES)) {
          return false
        }

        var sq = SQUARES[square];

        /* don't let the user place more than one king */
        if (
          piece.type == KING &&
          !(kings[piece.color] == EMPTY || kings[piece.color] == sq)
        ) {
          return false
        }

        board[sq] = { type: piece.type, color: piece.color };
        if (piece.type === KING) {
          kings[piece.color] = sq;
        }

        update_setup(generate_fen());

        return true
      }

      function remove(square) {
        var piece = get(square);
        board[SQUARES[square]] = null;
        if (piece && piece.type === KING) {
          kings[piece.color] = EMPTY;
        }

        update_setup(generate_fen());

        return piece
      }

      function build_move(board, from, to, flags, promotion) {
        var move = {
          color: turn,
          from: from,
          to: to,
          flags: flags,
          piece: board[from].type
        };

        if (promotion) {
          move.flags |= BITS.PROMOTION;
          move.promotion = promotion;
        }

        if (board[to]) {
          move.captured = board[to].type;
        } else if (flags & BITS.EP_CAPTURE) {
          move.captured = PAWN;
        }
        return move
      }

      function generate_moves(options) {
        function add_move(board, moves, from, to, flags) {
          /* if pawn promotion */
          if (
            board[from].type === PAWN &&
            (rank(to) === RANK_8 || rank(to) === RANK_1)
          ) {
            var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
            for (var i = 0, len = pieces.length; i < len; i++) {
              moves.push(build_move(board, from, to, flags, pieces[i]));
            }
          } else {
            moves.push(build_move(board, from, to, flags));
          }
        }

        var moves = [];
        var us = turn;
        var them = swap_color(us);
        var second_rank = { b: RANK_7, w: RANK_2 };

        var first_sq = SQUARES.a8;
        var last_sq = SQUARES.h1;
        var single_square = false;

        /* do we want legal moves? */
        var legal =
          typeof options !== 'undefined' && 'legal' in options
            ? options.legal
            : true;

        /* are we generating moves for a single square? */
        if (typeof options !== 'undefined' && 'square' in options) {
          if (options.square in SQUARES) {
            first_sq = last_sq = SQUARES[options.square];
            single_square = true;
          } else {
            /* invalid square */
            return []
          }
        }

        for (var i = first_sq; i <= last_sq; i++) {
          /* did we run off the end of the board */
          if (i & 0x88) {
            i += 7;
            continue
          }

          var piece = board[i];
          if (piece == null || piece.color !== us) {
            continue
          }

          if (piece.type === PAWN) {
            /* single square, non-capturing */
            var square = i + PAWN_OFFSETS[us][0];
            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);

              /* double square */
              var square = i + PAWN_OFFSETS[us][1];
              if (second_rank[us] === rank(i) && board[square] == null) {
                add_move(board, moves, i, square, BITS.BIG_PAWN);
              }
            }

            /* pawn captures */
            for (j = 2; j < 4; j++) {
              var square = i + PAWN_OFFSETS[us][j];
              if (square & 0x88) continue

              if (board[square] != null && board[square].color === them) {
                add_move(board, moves, i, square, BITS.CAPTURE);
              } else if (square === ep_square) {
                add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
              }
            }
          } else {
            for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
              var offset = PIECE_OFFSETS[piece.type][j];
              var square = i;

              while (true) {
                square += offset;
                if (square & 0x88) break

                if (board[square] == null) {
                  add_move(board, moves, i, square, BITS.NORMAL);
                } else {
                  if (board[square].color === us) break
                  add_move(board, moves, i, square, BITS.CAPTURE);
                  break
                }

                /* break, if knight or king */
                if (piece.type === 'n' || piece.type === 'k') break
              }
            }
          }
        }

        /* check for castling if: a) we're generating all moves, or b) we're doing
         * single square move generation on the king's square
         */
        if (!single_square || last_sq === kings[us]) {
          /* king-side castling */
          if (castling[us] & BITS.KSIDE_CASTLE) {
            var castling_from = kings[us];
            var castling_to = castling_from + 2;

            if (
              board[castling_from + 1] == null &&
              board[castling_to] == null &&
              !attacked(them, kings[us]) &&
              !attacked(them, castling_from + 1) &&
              !attacked(them, castling_to)
            ) {
              add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE);
            }
          }

          /* queen-side castling */
          if (castling[us] & BITS.QSIDE_CASTLE) {
            var castling_from = kings[us];
            var castling_to = castling_from - 2;

            if (
              board[castling_from - 1] == null &&
              board[castling_from - 2] == null &&
              board[castling_from - 3] == null &&
              !attacked(them, kings[us]) &&
              !attacked(them, castling_from - 1) &&
              !attacked(them, castling_to)
            ) {
              add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE);
            }
          }
        }

        /* return all pseudo-legal moves (this includes moves that allow the king
         * to be captured)
         */
        if (!legal) {
          return moves
        }

        /* filter out illegal moves */
        var legal_moves = [];
        for (var i = 0, len = moves.length; i < len; i++) {
          make_move(moves[i]);
          if (!king_attacked(us)) {
            legal_moves.push(moves[i]);
          }
          undo_move();
        }

        return legal_moves
      }

      /* convert a move from 0x88 coordinates to Standard Algebraic Notation
       * (SAN)
       *
       * @param {boolean} sloppy Use the sloppy SAN generator to work around over
       * disambiguation bugs in Fritz and Chessbase.  See below:
       *
       * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
       * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
       * 4. ... Ne7 is technically the valid SAN
       */
      function move_to_san(move, sloppy) {
        var output = '';

        if (move.flags & BITS.KSIDE_CASTLE) {
          output = 'O-O';
        } else if (move.flags & BITS.QSIDE_CASTLE) {
          output = 'O-O-O';
        } else {
          var disambiguator = get_disambiguator(move, sloppy);

          if (move.piece !== PAWN) {
            output += move.piece.toUpperCase() + disambiguator;
          }

          if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
            if (move.piece === PAWN) {
              output += algebraic(move.from)[0];
            }
            output += 'x';
          }

          output += algebraic(move.to);

          if (move.flags & BITS.PROMOTION) {
            output += '=' + move.promotion.toUpperCase();
          }
        }

        make_move(move);
        if (in_check()) {
          if (in_checkmate()) {
            output += '#';
          } else {
            output += '+';
          }
        }
        undo_move();

        return output
      }

      // parses all of the decorators out of a SAN string
      function stripped_san(move) {
        return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
      }

      function attacked(color, square) {
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          /* did we run off the end of the board */
          if (i & 0x88) {
            i += 7;
            continue
          }

          /* if empty square or wrong color */
          if (board[i] == null || board[i].color !== color) continue

          var piece = board[i];
          var difference = i - square;
          var index = difference + 119;

          if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
            if (piece.type === PAWN) {
              if (difference > 0) {
                if (piece.color === WHITE) return true
              } else {
                if (piece.color === BLACK) return true
              }
              continue
            }

            /* if the piece is a knight or a king */
            if (piece.type === 'n' || piece.type === 'k') return true

            var offset = RAYS[index];
            var j = i + offset;

            var blocked = false;
            while (j !== square) {
              if (board[j] != null) {
                blocked = true;
                break
              }
              j += offset;
            }

            if (!blocked) return true
          }
        }

        return false
      }

      function king_attacked(color) {
        return attacked(swap_color(color), kings[color])
      }

      function in_check() {
        return king_attacked(turn)
      }

      function in_checkmate() {
        return in_check() && generate_moves().length === 0
      }

      function in_stalemate() {
        return !in_check() && generate_moves().length === 0
      }

      function insufficient_material() {
        var pieces = {};
        var bishops = [];
        var num_pieces = 0;
        var sq_color = 0;

        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          sq_color = (sq_color + 1) % 2;
          if (i & 0x88) {
            i += 7;
            continue
          }

          var piece = board[i];
          if (piece) {
            pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
            if (piece.type === BISHOP) {
              bishops.push(sq_color);
            }
            num_pieces++;
          }
        }

        /* k vs. k */
        if (num_pieces === 2) {
          return true
        } else if (
          /* k vs. kn .... or .... k vs. kb */
          num_pieces === 3 &&
          (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
        ) {
          return true
        } else if (num_pieces === pieces[BISHOP] + 2) {
          /* kb vs. kb where any number of bishops are all on the same color */
          var sum = 0;
          var len = bishops.length;
          for (var i = 0; i < len; i++) {
            sum += bishops[i];
          }
          if (sum === 0 || sum === len) {
            return true
          }
        }

        return false
      }

      function in_threefold_repetition() {
        /* TODO: while this function is fine for casual use, a better
         * implementation would use a Zobrist key (instead of FEN). the
         * Zobrist key would be maintained in the make_move/undo_move functions,
         * avoiding the costly that we do below.
         */
        var moves = [];
        var positions = {};
        var repetition = false;

        while (true) {
          var move = undo_move();
          if (!move) break
          moves.push(move);
        }

        while (true) {
          /* remove the last two fields in the FEN string, they're not needed
           * when checking for draw by rep */
          var fen = generate_fen()
            .split(' ')
            .slice(0, 4)
            .join(' ');

          /* has the position occurred three or move times */
          positions[fen] = fen in positions ? positions[fen] + 1 : 1;
          if (positions[fen] >= 3) {
            repetition = true;
          }

          if (!moves.length) {
            break
          }
          make_move(moves.pop());
        }

        return repetition
      }

      function push(move) {
        history.push({
          move: move,
          kings: { b: kings.b, w: kings.w },
          turn: turn,
          castling: { b: castling.b, w: castling.w },
          ep_square: ep_square,
          half_moves: half_moves,
          move_number: move_number
        });
      }

      function make_move(move) {
        var us = turn;
        var them = swap_color(us);
        push(move);

        board[move.to] = board[move.from];
        board[move.from] = null;

        /* if ep capture, remove the captured pawn */
        if (move.flags & BITS.EP_CAPTURE) {
          if (turn === BLACK) {
            board[move.to - 16] = null;
          } else {
            board[move.to + 16] = null;
          }
        }

        /* if pawn promotion, replace with new piece */
        if (move.flags & BITS.PROMOTION) {
          board[move.to] = { type: move.promotion, color: us };
        }

        /* if we moved the king */
        if (board[move.to].type === KING) {
          kings[board[move.to].color] = move.to;

          /* if we castled, move the rook next to the king */
          if (move.flags & BITS.KSIDE_CASTLE) {
            var castling_to = move.to - 1;
            var castling_from = move.to + 1;
            board[castling_to] = board[castling_from];
            board[castling_from] = null;
          } else if (move.flags & BITS.QSIDE_CASTLE) {
            var castling_to = move.to + 1;
            var castling_from = move.to - 2;
            board[castling_to] = board[castling_from];
            board[castling_from] = null;
          }

          /* turn off castling */
          castling[us] = '';
        }

        /* turn off castling if we move a rook */
        if (castling[us]) {
          for (var i = 0, len = ROOKS[us].length; i < len; i++) {
            if (
              move.from === ROOKS[us][i].square &&
              castling[us] & ROOKS[us][i].flag
            ) {
              castling[us] ^= ROOKS[us][i].flag;
              break
            }
          }
        }

        /* turn off castling if we capture a rook */
        if (castling[them]) {
          for (var i = 0, len = ROOKS[them].length; i < len; i++) {
            if (
              move.to === ROOKS[them][i].square &&
              castling[them] & ROOKS[them][i].flag
            ) {
              castling[them] ^= ROOKS[them][i].flag;
              break
            }
          }
        }

        /* if big pawn move, update the en passant square */
        if (move.flags & BITS.BIG_PAWN) {
          if (turn === 'b') {
            ep_square = move.to - 16;
          } else {
            ep_square = move.to + 16;
          }
        } else {
          ep_square = EMPTY;
        }

        /* reset the 50 move counter if a pawn is moved or a piece is captured */
        if (move.piece === PAWN) {
          half_moves = 0;
        } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
          half_moves = 0;
        } else {
          half_moves++;
        }

        if (turn === BLACK) {
          move_number++;
        }
        turn = swap_color(turn);
      }

      function undo_move() {
        var old = history.pop();
        if (old == null) {
          return null
        }

        var move = old.move;
        kings = old.kings;
        turn = old.turn;
        castling = old.castling;
        ep_square = old.ep_square;
        half_moves = old.half_moves;
        move_number = old.move_number;

        var us = turn;
        var them = swap_color(turn);

        board[move.from] = board[move.to];
        board[move.from].type = move.piece; // to undo any promotions
        board[move.to] = null;

        if (move.flags & BITS.CAPTURE) {
          board[move.to] = { type: move.captured, color: them };
        } else if (move.flags & BITS.EP_CAPTURE) {
          var index;
          if (us === BLACK) {
            index = move.to - 16;
          } else {
            index = move.to + 16;
          }
          board[index] = { type: PAWN, color: them };
        }

        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
          var castling_to, castling_from;
          if (move.flags & BITS.KSIDE_CASTLE) {
            castling_to = move.to + 1;
            castling_from = move.to - 1;
          } else if (move.flags & BITS.QSIDE_CASTLE) {
            castling_to = move.to - 2;
            castling_from = move.to + 1;
          }

          board[castling_to] = board[castling_from];
          board[castling_from] = null;
        }

        return move
      }

      /* this function is used to uniquely identify ambiguous moves */
      function get_disambiguator(move, sloppy) {
        var moves = generate_moves({ legal: !sloppy });

        var from = move.from;
        var to = move.to;
        var piece = move.piece;

        var ambiguities = 0;
        var same_rank = 0;
        var same_file = 0;

        for (var i = 0, len = moves.length; i < len; i++) {
          var ambig_from = moves[i].from;
          var ambig_to = moves[i].to;
          var ambig_piece = moves[i].piece;

          /* if a move of the same piece type ends on the same to square, we'll
           * need to add a disambiguator to the algebraic notation
           */
          if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
            ambiguities++;

            if (rank(from) === rank(ambig_from)) {
              same_rank++;
            }

            if (file(from) === file(ambig_from)) {
              same_file++;
            }
          }
        }

        if (ambiguities > 0) {
          /* if there exists a similar moving piece on the same rank and file as
           * the move in question, use the square as the disambiguator
           */
          if (same_rank > 0 && same_file > 0) {
            return algebraic(from)
          } else if (same_file > 0) {
            /* if the moving piece rests on the same file, use the rank symbol as the
             * disambiguator
             */
            return algebraic(from).charAt(1)
          } else {
            /* else use the file symbol */
            return algebraic(from).charAt(0)
          }
        }

        return ''
      }

      function ascii() {
        var s = '   +------------------------+\n';
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          /* display the rank */
          if (file(i) === 0) {
            s += ' ' + '87654321'[rank(i)] + ' |';
          }

          /* empty piece */
          if (board[i] == null) {
            s += ' . ';
          } else {
            var piece = board[i].type;
            var color = board[i].color;
            var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
            s += ' ' + symbol + ' ';
          }

          if ((i + 1) & 0x88) {
            s += '|\n';
            i += 8;
          }
        }
        s += '   +------------------------+\n';
        s += '     a  b  c  d  e  f  g  h\n';

        return s
      }

      // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
      function move_from_san(move, sloppy) {
        // strip off any move decorations: e.g Nf3+?!
        var clean_move = stripped_san(move);

        // if we're using the sloppy parser run a regex to grab piece, to, and from
        // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7
        if (sloppy) {
          var matches = clean_move.match(
            /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
          );
          if (matches) {
            var piece = matches[1];
            var from = matches[2];
            var to = matches[3];
            var promotion = matches[4];
          }
        }

        var moves = generate_moves();
        for (var i = 0, len = moves.length; i < len; i++) {
          // try the strict parser first, then the sloppy parser if requested
          // by the user
          if (
            clean_move === stripped_san(move_to_san(moves[i])) ||
            (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))
          ) {
            return moves[i]
          } else {
            if (
              matches &&
              (!piece || piece.toLowerCase() == moves[i].piece) &&
              SQUARES[from] == moves[i].from &&
              SQUARES[to] == moves[i].to &&
              (!promotion || promotion.toLowerCase() == moves[i].promotion)
            ) {
              return moves[i]
            }
          }
        }

        return null
      }

      /*****************************************************************************
       * UTILITY FUNCTIONS
       ****************************************************************************/
      function rank(i) {
        return i >> 4
      }

      function file(i) {
        return i & 15
      }

      function algebraic(i) {
        var f = file(i),
          r = rank(i);
        return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
      }

      function swap_color(c) {
        return c === WHITE ? BLACK : WHITE
      }

      function is_digit(c) {
        return '0123456789'.indexOf(c) !== -1
      }

      /* pretty = external move object */
      function make_pretty(ugly_move) {
        var move = clone(ugly_move);
        move.san = move_to_san(move, false);
        move.to = algebraic(move.to);
        move.from = algebraic(move.from);

        var flags = '';

        for (var flag in BITS) {
          if (BITS[flag] & move.flags) {
            flags += FLAGS[flag];
          }
        }
        move.flags = flags;

        return move
      }

      function clone(obj) {
        var dupe = obj instanceof Array ? [] : {};

        for (var property in obj) {
          if (typeof property === 'object') {
            dupe[property] = clone(obj[property]);
          } else {
            dupe[property] = obj[property];
          }
        }

        return dupe
      }

      function trim(str) {
        return str.replace(/^\s+|\s+$/g, '')
      }

      /*****************************************************************************
       * DEBUGGING UTILITIES
       ****************************************************************************/
      function perft(depth) {
        var moves = generate_moves({ legal: false });
        var nodes = 0;
        var color = turn;

        for (var i = 0, len = moves.length; i < len; i++) {
          make_move(moves[i]);
          if (!king_attacked(color)) {
            if (depth - 1 > 0) {
              var child_nodes = perft(depth - 1);
              nodes += child_nodes;
            } else {
              nodes++;
            }
          }
          undo_move();
        }

        return nodes
      }

      return {
        /***************************************************************************
         * PUBLIC CONSTANTS (is there a better way to do this?)
         **************************************************************************/
        WHITE: WHITE,
        BLACK: BLACK,
        PAWN: PAWN,
        KNIGHT: KNIGHT,
        BISHOP: BISHOP,
        ROOK: ROOK,
        QUEEN: QUEEN,
        KING: KING,
        SQUARES: (function() {
          /* from the ECMA-262 spec (section 12.6.4):
           * "The mechanics of enumerating the properties ... is
           * implementation dependent"
           * so: for (var sq in SQUARES) { keys.push(sq); } might not be
           * ordered correctly
           */
          var keys = [];
          for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            if (i & 0x88) {
              i += 7;
              continue
            }
            keys.push(algebraic(i));
          }
          return keys
        })(),
        FLAGS: FLAGS,

        /***************************************************************************
         * PUBLIC API
         **************************************************************************/
        load: function(fen) {
          return load(fen)
        },

        reset: function() {
          return reset()
        },

        moves: function(options) {
          /* The internal representation of a chess move is in 0x88 format, and
           * not meant to be human-readable.  The code below converts the 0x88
           * square coordinates to algebraic coordinates.  It also prunes an
           * unnecessary move keys resulting from a verbose call.
           */

          var ugly_moves = generate_moves(options);
          var moves = [];

          for (var i = 0, len = ugly_moves.length; i < len; i++) {
            /* does the user want a full move object (most likely not), or just
             * SAN
             */
            if (
              typeof options !== 'undefined' &&
              'verbose' in options &&
              options.verbose
            ) {
              moves.push(make_pretty(ugly_moves[i]));
            } else {
              moves.push(move_to_san(ugly_moves[i], false));
            }
          }

          return moves
        },

        in_check: function() {
          return in_check()
        },

        in_checkmate: function() {
          return in_checkmate()
        },

        in_stalemate: function() {
          return in_stalemate()
        },

        in_draw: function() {
          return (
            half_moves >= 100 ||
            in_stalemate() ||
            insufficient_material() ||
            in_threefold_repetition()
          )
        },

        insufficient_material: function() {
          return insufficient_material()
        },

        in_threefold_repetition: function() {
          return in_threefold_repetition()
        },

        game_over: function() {
          return (
            half_moves >= 100 ||
            in_checkmate() ||
            in_stalemate() ||
            insufficient_material() ||
            in_threefold_repetition()
          )
        },

        validate_fen: function(fen) {
          return validate_fen(fen)
        },

        fen: function() {
          return generate_fen()
        },

        board: function() {
          var output = [],
            row = [];

          for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            if (board[i] == null) {
              row.push(null);
            } else {
              row.push({ type: board[i].type, color: board[i].color });
            }
            if ((i + 1) & 0x88) {
              output.push(row);
              row = [];
              i += 8;
            }
          }

          return output
        },

        pgn: function(options) {
          /* using the specification from http://www.chessclub.com/help/PGN-spec
           * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
           */
          var newline =
            typeof options === 'object' && typeof options.newline_char === 'string'
              ? options.newline_char
              : '\n';
          var max_width =
            typeof options === 'object' && typeof options.max_width === 'number'
              ? options.max_width
              : 0;
          var result = [];
          var header_exists = false;

          /* add the PGN header headerrmation */
          for (var i in header) {
            /* TODO: order of enumerated properties in header object is not
             * guaranteed, see ECMA-262 spec (section 12.6.4)
             */
            result.push('[' + i + ' "' + header[i] + '"]' + newline);
            header_exists = true;
          }

          if (header_exists && history.length) {
            result.push(newline);
          }

          /* pop all of history onto reversed_history */
          var reversed_history = [];
          while (history.length > 0) {
            reversed_history.push(undo_move());
          }

          var moves = [];
          var move_string = '';

          /* build the list of moves.  a move_string looks like: "3. e3 e6" */
          while (reversed_history.length > 0) {
            var move = reversed_history.pop();

            /* if the position started with black to move, start PGN with 1. ... */
            if (!history.length && move.color === 'b') {
              move_string = move_number + '. ...';
            } else if (move.color === 'w') {
              /* store the previous generated move_string if we have one */
              if (move_string.length) {
                moves.push(move_string);
              }
              move_string = move_number + '.';
            }

            move_string = move_string + ' ' + move_to_san(move, false);
            make_move(move);
          }

          /* are there any other leftover moves? */
          if (move_string.length) {
            moves.push(move_string);
          }

          /* is there a result? */
          if (typeof header.Result !== 'undefined') {
            moves.push(header.Result);
          }

          /* history should be back to what is was before we started generating PGN,
           * so join together moves
           */
          if (max_width === 0) {
            return result.join('') + moves.join(' ')
          }

          /* wrap the PGN output at max_width */
          var current_width = 0;
          for (var i = 0; i < moves.length; i++) {
            /* if the current move will push past max_width */
            if (current_width + moves[i].length > max_width && i !== 0) {
              /* don't end the line with whitespace */
              if (result[result.length - 1] === ' ') {
                result.pop();
              }

              result.push(newline);
              current_width = 0;
            } else if (i !== 0) {
              result.push(' ');
              current_width++;
            }
            result.push(moves[i]);
            current_width += moves[i].length;
          }

          return result.join('')
        },

        load_pgn: function(pgn, options) {
          // allow the user to specify the sloppy move parser to work around over
          // disambiguation bugs in Fritz and Chessbase
          var sloppy =
            typeof options !== 'undefined' && 'sloppy' in options
              ? options.sloppy
              : false;

          function mask(str) {
            return str.replace(/\\/g, '\\')
          }

          function has_keys(object) {
            for (var key in object) {
              return true
            }
            return false
          }

          function parse_pgn_header(header, options) {
            var newline_char =
              typeof options === 'object' &&
              typeof options.newline_char === 'string'
                ? options.newline_char
                : '\r?\n';
            var header_obj = {};
            var headers = header.split(new RegExp(mask(newline_char)));
            var key = '';
            var value = '';

            for (var i = 0; i < headers.length; i++) {
              key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
              value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, '$1');
              if (trim(key).length > 0) {
                header_obj[key] = value;
              }
            }

            return header_obj
          }

          var newline_char =
            typeof options === 'object' && typeof options.newline_char === 'string'
              ? options.newline_char
              : '\r?\n';

          // RegExp to split header. Takes advantage of the fact that header and movetext
          // will always have a blank line between them (ie, two newline_char's).
          // With default newline_char, will equal: /^(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/
          var header_regex = new RegExp(
            '^(\\[((?:' +
              mask(newline_char) +
              ')|.)*\\])' +
              '(?:' +
              mask(newline_char) +
              '){2}'
          );

          // If no header given, begin with moves.
          var header_string = header_regex.test(pgn)
            ? header_regex.exec(pgn)[1]
            : '';

          // Put the board in the starting position
          reset();

          /* parse PGN header */
          var headers = parse_pgn_header(header_string, options);
          for (var key in headers) {
            set_header([key, headers[key]]);
          }

          /* load the starting position indicated by [Setup '1'] and
           * [FEN position] */
          if (headers['SetUp'] === '1') {
            if (!('FEN' in headers && load(headers['FEN'], true))) {
              // second argument to load: don't clear the headers
              return false
            }
          }

          /* delete header to get the moves */
          var ms = pgn
            .replace(header_string, '')
            .replace(new RegExp(mask(newline_char), 'g'), ' ');

          /* delete comments */
          ms = ms.replace(/(\{[^}]+\})+?/g, '');

          /* delete recursive annotation variations */
          var rav_regex = /(\([^\(\)]+\))+?/g;
          while (rav_regex.test(ms)) {
            ms = ms.replace(rav_regex, '');
          }

          /* delete move numbers */
          ms = ms.replace(/\d+\.(\.\.)?/g, '');

          /* delete ... indicating black to move */
          ms = ms.replace(/\.\.\./g, '');

          /* delete numeric annotation glyphs */
          ms = ms.replace(/\$\d+/g, '');

          /* trim and get array of moves */
          var moves = trim(ms).split(new RegExp(/\s+/));

          /* delete empty entries */
          moves = moves
            .join(',')
            .replace(/,,+/g, ',')
            .split(',');
          var move = '';

          for (var half_move = 0; half_move < moves.length - 1; half_move++) {
            move = move_from_san(moves[half_move], sloppy);

            /* move not possible! (don't clear the board to examine to show the
             * latest valid position)
             */
            if (move == null) {
              return false
            } else {
              make_move(move);
            }
          }

          /* examine last move */
          move = moves[moves.length - 1];
          if (POSSIBLE_RESULTS.indexOf(move) > -1) {
            if (has_keys(header) && typeof header.Result === 'undefined') {
              set_header(['Result', move]);
            }
          } else {
            move = move_from_san(move, sloppy);
            if (move == null) {
              return false
            } else {
              make_move(move);
            }
          }
          return true
        },

        header: function() {
          return set_header(arguments)
        },

        ascii: function() {
          return ascii()
        },

        turn: function() {
          return turn
        },

        move: function(move, options) {
          /* The move function can be called with in the following parameters:
           *
           * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
           *
           * .move({ from: 'h7', <- where the 'move' is a move object (additional
           *         to :'h8',      fields are ignored)
           *         promotion: 'q',
           *      })
           */

          // allow the user to specify the sloppy move parser to work around over
          // disambiguation bugs in Fritz and Chessbase
          var sloppy =
            typeof options !== 'undefined' && 'sloppy' in options
              ? options.sloppy
              : false;

          var move_obj = null;

          if (typeof move === 'string') {
            move_obj = move_from_san(move, sloppy);
          } else if (typeof move === 'object') {
            var moves = generate_moves();

            /* convert the pretty move object to an ugly move object */
            for (var i = 0, len = moves.length; i < len; i++) {
              if (
                move.from === algebraic(moves[i].from) &&
                move.to === algebraic(moves[i].to) &&
                (!('promotion' in moves[i]) ||
                  move.promotion === moves[i].promotion)
              ) {
                move_obj = moves[i];
                break
              }
            }
          }

          /* failed to find move */
          if (!move_obj) {
            return null
          }

          /* need to make a copy of move because we can't generate SAN after the
           * move is made
           */
          var pretty_move = make_pretty(move_obj);

          make_move(move_obj);

          return pretty_move
        },

        undo: function() {
          var move = undo_move();
          return move ? make_pretty(move) : null
        },

        clear: function() {
          return clear()
        },

        put: function(piece, square) {
          return put(piece, square)
        },

        get: function(square) {
          return get(square)
        },

        remove: function(square) {
          return remove(square)
        },

        perft: function(depth) {
          return perft(depth)
        },

        square_color: function(square) {
          if (square in SQUARES) {
            var sq_0x88 = SQUARES[square];
            return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? 'light' : 'dark'
          }

          return null
        },

        history: function(options) {
          var reversed_history = [];
          var move_history = [];
          var verbose =
            typeof options !== 'undefined' &&
            'verbose' in options &&
            options.verbose;

          while (history.length > 0) {
            reversed_history.push(undo_move());
          }

          while (reversed_history.length > 0) {
            var move = reversed_history.pop();
            if (verbose) {
              move_history.push(make_pretty(move));
            } else {
              move_history.push(move_to_san(move));
            }
            make_move(move);
          }

          return move_history
        }
      }
    };

    /* export Chess object if using node or any other CommonJS compatible
     * environment */
    exports.Chess = Chess;
    });

    /* src\components\chessboard\chessboard.svelte generated by Svelte v3.46.4 */

    const { console: console_1$3, document: document_1 } = globals;
    const file$8 = "src\\components\\chessboard\\chessboard.svelte";

    // (264:4) {#if board==undefined}
    function create_if_block$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "There was an error rendering the chessboard, please reload the page...";
    			set_style(div, "width", "400px");
    			set_style(div, "height", "400px");
    			add_location(div, file$8, 264, 8, 8242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(264:4) {#if board==undefined}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let script0;
    	let script0_src_value;
    	let link;
    	let script1;
    	let script1_src_value;
    	let t0;
    	let div5;
    	let t1;
    	let div0;
    	let p;
    	let t2;
    	let div1;
    	let t3;
    	let div2;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let div3;
    	let input0;
    	let t8;
    	let button2;
    	let t10;
    	let div4;
    	let input1;
    	let t11;
    	let button3;
    	let t13;
    	let label;
    	let input2;
    	let t14;
    	let mounted;
    	let dispose;
    	let if_block = /*board*/ ctx[0] == undefined && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			link = element("link");
    			script1 = element("script");
    			t0 = space();
    			div5 = element("div");
    			if (if_block) if_block.c();
    			t1 = space();
    			div0 = element("div");
    			p = element("p");
    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Start Position";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Clear Board";
    			t7 = space();
    			div3 = element("div");
    			input0 = element("input");
    			t8 = space();
    			button2 = element("button");
    			button2.textContent = "Copy Position";
    			t10 = space();
    			div4 = element("div");
    			input1 = element("input");
    			t11 = space();
    			button3 = element("button");
    			button3.textContent = "Set Position";
    			t13 = space();
    			label = element("label");
    			input2 = element("input");
    			t14 = text("  Only Legal Moves");
    			if (!src_url_equal(script0.src, script0_src_value = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$8, 1, 4, 19);
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "href", "./chessboard-1.0.0.min.css");
    			add_location(link, file$8, 2, 4, 115);
    			if (!src_url_equal(script1.src, script1_src_value = "./chessboard-1.0.0.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$8, 3, 4, 179);
    			attr_dev(p, "id", "who-plays");
    			add_location(p, file$8, 269, 8, 8415);
    			add_location(div0, file$8, 268, 4, 8400);
    			attr_dev(div1, "id", "board");
    			set_style(div1, "width", "400px");
    			add_location(div1, file$8, 271, 4, 8455);
    			attr_dev(button0, "id", "startBtn");
    			attr_dev(button0, "class", "svelte-31b8wl");
    			add_location(button0, file$8, 273, 8, 8535);
    			attr_dev(button1, "id", "clearBtn");
    			attr_dev(button1, "class", "svelte-31b8wl");
    			add_location(button1, file$8, 274, 8, 8611);
    			attr_dev(div2, "class", "btn-div svelte-31b8wl");
    			add_location(div2, file$8, 272, 4, 8504);
    			attr_dev(input0, "type", "text");
    			input0.value = "";
    			attr_dev(input0, "id", "copy-fen");
    			attr_dev(input0, "class", "svelte-31b8wl");
    			add_location(input0, file$8, 277, 8, 8727);
    			set_style(button2, "width", "160px");
    			add_location(button2, file$8, 279, 8, 8830);
    			attr_dev(div3, "id", "fen-copy-div");
    			attr_dev(div3, "class", "svelte-31b8wl");
    			add_location(div3, file$8, 276, 4, 8694);
    			attr_dev(input1, "type", "text");
    			input1.value = "";
    			attr_dev(input1, "id", "get-fen");
    			attr_dev(input1, "class", "svelte-31b8wl");
    			add_location(input1, file$8, 282, 8, 8951);
    			attr_dev(button3, "id", "get-fen-btn");
    			attr_dev(button3, "class", "svelte-31b8wl");
    			add_location(button3, file$8, 284, 8, 9053);
    			attr_dev(div4, "id", "fen-get-div");
    			attr_dev(div4, "class", "svelte-31b8wl");
    			add_location(div4, file$8, 281, 4, 8919);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "id", "legal");
    			attr_dev(input2, "name", "legal");
    			input2.value = "yes";
    			add_location(input2, file$8, 287, 8, 9169);
    			attr_dev(label, "for", "legal");
    			add_location(label, file$8, 286, 4, 9140);
    			attr_dev(div5, "class", "container svelte-31b8wl");
    			add_location(div5, file$8, 262, 0, 8181);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, script0);
    			append_dev(document_1.head, link);
    			append_dev(document_1.head, script1);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			if (if_block) if_block.m(div5, null);
    			append_dev(div5, t1);
    			append_dev(div5, div0);
    			append_dev(div0, p);
    			append_dev(div5, t2);
    			append_dev(div5, div1);
    			append_dev(div5, t3);
    			append_dev(div5, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t5);
    			append_dev(div2, button1);
    			append_dev(div5, t7);
    			append_dev(div5, div3);
    			append_dev(div3, input0);
    			append_dev(div3, t8);
    			append_dev(div3, button2);
    			append_dev(div5, t10);
    			append_dev(div5, div4);
    			append_dev(div4, input1);
    			append_dev(div4, t11);
    			append_dev(div4, button3);
    			append_dev(div5, t13);
    			append_dev(div5, label);
    			append_dev(label, input2);
    			append_dev(label, t14);

    			if (!mounted) {
    				dispose = [
    					listen_dev(script1, "load", /*initBoard*/ ctx[1], false, false, false),
    					listen_dev(button0, "click", /*initBoard*/ ctx[1], false, false, false),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*board*/ ctx[0].clear)) /*board*/ ctx[0].clear.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(button2, "click", copyFen, false, false, false),
    					listen_dev(button3, "click", /*getBoardPos*/ ctx[2], false, false, false),
    					listen_dev(input2, "click", /*checkLegal*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (/*board*/ ctx[0] == undefined) {
    				if (if_block) ; else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(div5, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(link);
    			detach_dev(script1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function onDragStart(source, piece) {
    	
    } //console.log('In onDragStart()');

    function onMouseoutSquare(square, piece) {
    	removeGreySquares();
    }

    function removeGreySquares() {
    	var rm_sq = document.querySelectorAll('#board .square-55d63');

    	for (var i = 0; i < rm_sq.length; i++) {
    		rm_sq[i].style.background = '';
    	}
    }

    function copyFen() {
    	var copy_fen_input = document.querySelector("#copy-fen");

    	/* Select the text field */
    	copy_fen_input.select();

    	copy_fen_input.setSelectionRange(0, 99999); /* For mobile devices */

    	/* Copy the text inside the text field */
    	navigator.clipboard.writeText(copy_fen_input.value);
    } /* Alert the copied text */ //alert("Copied the text: " + copy_fen_input.value);

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chessboard', slots, []);
    	var board;
    	let copy_fen;
    	let fen = 'start';
    	let initial_pos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    	var legal = true;
    	var game;
    	var whiteSquareGrey = '#a9a9a9';
    	var blackSquareGrey = '#696969';

    	// TODO unsubscribeSquare = selectedSquare.subscribe(s => // highlight squares )
    	// onDestroy(unsubscribeSquare);
    	const unsubscribeFen = curr_fen.subscribe(new_fen => {
    		if (new_fen != copy_fen && board) {
    			// if fen actually changed, update board
    			board.position(new_fen);
    		}
    	});

    	onDestroy(unsubscribeFen); // prevent memory leak

    	onMount(() => {
    		console.log('Mounted');
    		console.log('Curr_fen', curr_fen, fen);
    		copyFenField();
    		playerChance(false);
    	}); //game = new Chess();
    	//console.log('Game: ', game);

    	// Gets called by "./chessboard-1.0.0.min.js" after onMount()
    	function initBoard() {
    		//console.log('In init Board');
    		game = new chess.Chess();

    		$$invalidate(0, board = Chessboard('board', {
    			draggable: true,
    			position: 'start',
    			onDrop,
    			onChange,
    			onDragStart,
    			onMouseoverSquare,
    			onMouseoutSquare,
    			sparePieces: false, //(legal==true)? false: true,
    			dropOffBoard: legal == true ? 'snapback' : 'trash'
    		}));

    		//console.log('Board', board);
    		//console.log('Vars', unsubscribeFen, curr_fen, 'Fen', fen);
    		copy_fen = board.fen();

    		copyFenField();
    		curr_fen.set(copy_fen);
    	}

    	function onDrop(source, target, piece, newPos, oldPos, orientation) {
    		if (Chessboard.objToFen(oldPos) == Chessboard.objToFen(newPos)) {
    			return false;
    		}

    		removeGreySquares();

    		//console.log('Source: ' + source);
    		//console.log('Target: ' + target);
    		//console.log('Piece: ' + piece);
    		//console.log('New position: ' + Chessboard.objToFen(newPos));
    		//console.log('Old position: ' + Chessboard.objToFen(oldPos));
    		//console.log('Orientation: ' + orientation);
    		//console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    		//board.flip(); // Flip of board after move (Make Button)
    		var move = game.move({
    			from: source,
    			to: target,
    			promotion: 'q', // NOTE: always promote to a queen for example simplicity
    			
    		});

    		if (legal) {
    			console.log('Move: ', move);

    			// illegal move
    			if (move === null) {
    				return 'snapback';
    			}

    			if (move.san == 'O-O') {
    				if (move.color == 'w') {
    					board.move('h1-f1');
    				} else if (move.color == 'b') {
    					board.move('h8-f8');
    				}
    			}

    			if (move.san == 'O-O-O') {
    				if (move.color == 'w') {
    					board.move('a1-d1');
    				} else if (move.color == 'b') {
    					board.move('a8-d8');
    				}
    			}
    		}
    	}

    	function onChange(oldPos, newPos) {
    		console.log('On Change', Chessboard.objToFen(newPos));
    		copy_fen = Chessboard.objToFen(newPos);
    		copyFenField();
    		console.log('Turn to Play: ', game.turn());

    		//curr_fen.set(copy_fen) ;
    		curr_fen.set(copy_fen);

    		curr_fen.subscribe(value => {
    			console.log('After Change, Current Fen: ', value);
    		});

    		//console.log('Curr Fen: ', curr_fen);
    		playerChance(legal);
    	}

    	function onMouseoverSquare(square, piece) {
    		// get list of possible moves for this square
    		var moves = game.moves({ square, verbose: true });

    		//console.log(square, piece, 'Moves: ', moves);
    		// exit if there are no moves available for this square
    		//if (moves.length === 0) { return; }
    		// highlight the square they moused over
    		greySquare(square);

    		// highlight the possible squares for this piece
    		for (var i = 0; i < moves.length; i++) {
    			greySquare(moves[i].to);
    		}
    	}

    	function greySquare(square) {
    		var sq = document.querySelector('#board .square-' + square);

    		//console.log('Grey Square(): ', sq);
    		var sq_class = sq.getAttribute('class');

    		var background = whiteSquareGrey;

    		if (sq_class.includes('black-3c85d')) {
    			//console.log('Grey Square() Class: ', sq_class);
    			background = blackSquareGrey;
    		}

    		//sq.setAttribute('background-color', 'blue');
    		//sq.setAttribute('background', 'red');
    		//sq.setAttribute('fill', 'red');
    		sq.style.background = background;
    	}

    	/*
    const unsubscribeFen = curr_fen.subscribe(new_fen => {
        fen = new_fen;
    })
    onDestroy(unsubscribeFen);  // prevent memory leak
    */
    	function copyFenField() {
    		var copy_fen_input = document.querySelector("#copy-fen");

    		if (copy_fen == undefined) {
    			copy_fen_input.value = initial_pos;
    		} else {
    			copy_fen_input.value = copy_fen;
    		}
    	} //console.log('In Copy Fen', copy_fen);

    	//console.log('In copyFen()');
    	function getBoardPos() {
    		console.log('In getBoardPos()');
    		var get_fen_input = document.querySelector("#get-fen");
    		let get_pos = get_fen_input.value;

    		if (get_pos == "") {
    			board.clear(true);
    		}

    		board.position(get_pos, true);
    		get_fen_input.value = "";
    	}

    	function checkLegal() {
    		var legal_checkbox = document.querySelector('#legal');
    		console.log('LegalChechBox: ', legal_checkbox.checked);
    		legal = legal_checkbox.checked;
    		initBoard();
    		playerChance(legal);
    	}

    	function playerChance(flag) {
    		//console.log('Here', flag);
    		const h1 = document.createElement("h1");

    		var parEle = document.querySelector('#who-plays');
    		var tex_to_add;

    		if (flag == false) {
    			parEle.innerHTML = '';
    			tex_to_add = document.createTextNode('Move pieces to update the visualization.');
    		} else if (flag == true) {
    			parEle.innerHTML = '';
    			tex_to_add = document.createTextNode('Move of: ' + game.turn());
    		}

    		h1.appendChild(tex_to_add);
    		parEle.appendChild(h1);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Chessboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		curr_fen,
    		selectedSquare,
    		Chess: chess.Chess,
    		board,
    		copy_fen,
    		fen,
    		initial_pos,
    		legal,
    		game,
    		whiteSquareGrey,
    		blackSquareGrey,
    		unsubscribeFen,
    		initBoard,
    		onDrop,
    		onChange,
    		onDragStart,
    		onMouseoverSquare,
    		greySquare,
    		onMouseoutSquare,
    		removeGreySquares,
    		copyFenField,
    		copyFen,
    		getBoardPos,
    		checkLegal,
    		playerChance
    	});

    	$$self.$inject_state = $$props => {
    		if ('board' in $$props) $$invalidate(0, board = $$props.board);
    		if ('copy_fen' in $$props) copy_fen = $$props.copy_fen;
    		if ('fen' in $$props) fen = $$props.fen;
    		if ('initial_pos' in $$props) initial_pos = $$props.initial_pos;
    		if ('legal' in $$props) legal = $$props.legal;
    		if ('game' in $$props) game = $$props.game;
    		if ('whiteSquareGrey' in $$props) whiteSquareGrey = $$props.whiteSquareGrey;
    		if ('blackSquareGrey' in $$props) blackSquareGrey = $$props.blackSquareGrey;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [board, initBoard, getBoardPos, checkLegal];
    }

    class Chessboard_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chessboard_1",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\header\header.svelte generated by Svelte v3.46.4 */
    const file$7 = "src\\components\\header\\header.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Chessboard Visualization:\r\n        A project for CS549 Visual Analytics";
    			attr_dev(h1, "class", "svelte-i38bul");
    			add_location(h1, file$7, 5, 4, 102);
    			attr_dev(div, "class", "container svelte-i38bul");
    			add_location(div, file$7, 4, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ gameDataStore });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\currentViz\Tooltip.svelte generated by Svelte v3.46.4 */

    const file$6 = "src\\components\\currentViz\\Tooltip.svelte";

    // (29:0) {#if isHovered}
    function create_if_block$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*title*/ ctx[0]);
    			set_style(div, "top", /*y*/ ctx[3] + "px");
    			set_style(div, "left", /*x*/ ctx[2] + "px");
    			attr_dev(div, "class", "tooltip svelte-34ejdt");
    			add_location(div, file$6, 29, 1, 465);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);

    			if (dirty & /*y*/ 8) {
    				set_style(div, "top", /*y*/ ctx[3] + "px");
    			}

    			if (dirty & /*x*/ 4) {
    				set_style(div, "left", /*x*/ ctx[2] + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(29:0) {#if isHovered}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let if_block = /*isHovered*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(div, file$6, 21, 0, 333);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseover", /*mouseOver*/ ctx[4], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseLeave*/ ctx[6], false, false, false),
    					listen_dev(div, "mousemove", /*mouseMove*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isHovered*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, ['default']);
    	let { title = '' } = $$props;
    	let isHovered = false;
    	let x;
    	let y;

    	function mouseOver(event) {
    		$$invalidate(1, isHovered = true);
    		$$invalidate(2, x = event.pageX + 5);
    		$$invalidate(3, y = event.pageY + 5);
    	}

    	function mouseMove(event) {
    		$$invalidate(2, x = event.pageX + 5);
    		$$invalidate(3, y = event.pageY + 5);
    	}

    	function mouseLeave() {
    		$$invalidate(1, isHovered = false);
    	}

    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		isHovered,
    		x,
    		y,
    		mouseOver,
    		mouseMove,
    		mouseLeave
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('isHovered' in $$props) $$invalidate(1, isHovered = $$props.isHovered);
    		if ('x' in $$props) $$invalidate(2, x = $$props.x);
    		if ('y' in $$props) $$invalidate(3, y = $$props.y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, isHovered, x, y, mouseOver, mouseMove, mouseLeave, $$scope, slots];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get title() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        let len = node.getTotalLength();
        const style = getComputedStyle(node);
        if (style.strokeLinecap !== 'butt') {
            len += parseInt(style.strokeWidth);
        }
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }

    /* src\components\currentViz\current_viz.svelte generated by Svelte v3.46.4 */

    const { console: console_1$2 } = globals;
    const file$5 = "src\\components\\currentViz\\current_viz.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (51:12) {#if t.b !=0  }
    function create_if_block_2$1(ctx) {
    	let div;
    	let t0_value = /*t*/ ctx[3].b + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text("%");
    			attr_dev(div, "class", "bar val-a svelte-wc0dmo");
    			set_style(div, "flex-basis", /*t*/ ctx[3].b + "%");
    			add_location(div, file$5, 51, 14, 1773);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posData*/ 1 && t0_value !== (t0_value = /*t*/ ctx[3].b + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*posData*/ 1) {
    				set_style(div, "flex-basis", /*t*/ ctx[3].b + "%");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(51:12) {#if t.b !=0  }",
    		ctx
    	});

    	return block;
    }

    // (55:12) {#if t.t !=0  }
    function create_if_block_1$1(ctx) {
    	let div;
    	let t0_value = /*t*/ ctx[3].t + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text("%");
    			attr_dev(div, "class", "bar val-b svelte-wc0dmo");
    			set_style(div, "flex-basis", /*t*/ ctx[3].t + "%");
    			add_location(div, file$5, 55, 14, 1922);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posData*/ 1 && t0_value !== (t0_value = /*t*/ ctx[3].t + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*posData*/ 1) {
    				set_style(div, "flex-basis", /*t*/ ctx[3].t + "%");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(55:12) {#if t.t !=0  }",
    		ctx
    	});

    	return block;
    }

    // (59:12) {#if t.w !=0  }
    function create_if_block$3(ctx) {
    	let div;
    	let t0_value = /*t*/ ctx[3].w + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text("%");
    			attr_dev(div, "class", "bar val-c svelte-wc0dmo");
    			set_style(div, "flex-basis", /*t*/ ctx[3].w + "%");
    			add_location(div, file$5, 59, 14, 2072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posData*/ 1 && t0_value !== (t0_value = /*t*/ ctx[3].w + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*posData*/ 1) {
    				set_style(div, "flex-basis", /*t*/ ctx[3].w + "%");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(59:12) {#if t.w !=0  }",
    		ctx
    	});

    	return block;
    }

    // (43:6) <Tooltip title="Game counts for {name[i] || 0}: Black {t.bG || 0}, Tie {t.tG || 0}, White {t.wG || 0} ">
    function create_default_slot_1(ctx) {
    	let div2;
    	let div0;
    	let p;
    	let t0_value = /*name*/ ctx[1][/*i*/ ctx[5]] + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let t4;
    	let if_block0 = /*t*/ ctx[3].b != 0 && create_if_block_2$1(ctx);
    	let if_block1 = /*t*/ ctx[3].t != 0 && create_if_block_1$1(ctx);
    	let if_block2 = /*t*/ ctx[3].w != 0 && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			attr_dev(p, "text-align", "right");
    			add_location(p, file$5, 47, 12, 1633);
    			attr_dev(div0, "class", "label svelte-wc0dmo");
    			add_location(div0, file$5, 46, 10, 1600);
    			attr_dev(div1, "class", "bar-container svelte-wc0dmo");
    			add_location(div1, file$5, 49, 10, 1701);
    			attr_dev(div2, "class", "row svelte-wc0dmo");
    			add_location(div2, file$5, 43, 8, 1567);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block2) if_block2.m(div1, null);
    			insert_dev(target, t4, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*t*/ ctx[3].b != 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*t*/ ctx[3].t != 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div1, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*t*/ ctx[3].w != 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(43:6) <Tooltip title=\\\"Game counts for {name[i] || 0}: Black {t.bG || 0}, Tie {t.tG || 0}, White {t.wG || 0} \\\">",
    		ctx
    	});

    	return block;
    }

    // (42:4) {#each posData as t,i}
    function create_each_block_1$1(ctx) {
    	let tooltip;
    	let current;

    	tooltip = new Tooltip({
    			props: {
    				title: "Game counts for " + (/*name*/ ctx[1][/*i*/ ctx[5]] || 0) + ": Black " + (/*t*/ ctx[3].bG || 0) + ", Tie " + (/*t*/ ctx[3].tG || 0) + ", White " + (/*t*/ ctx[3].wG || 0) + " ",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip_changes = {};
    			if (dirty & /*posData*/ 1) tooltip_changes.title = "Game counts for " + (/*name*/ ctx[1][/*i*/ ctx[5]] || 0) + ": Black " + (/*t*/ ctx[3].bG || 0) + ", Tie " + (/*t*/ ctx[3].tG || 0) + ", White " + (/*t*/ ctx[3].wG || 0) + " ";

    			if (dirty & /*$$scope, posData*/ 129) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(42:4) {#each posData as t,i}",
    		ctx
    	});

    	return block;
    }

    // (76:6) <Tooltip title="Game counts: Beginner {posData[0].total || 0}, Intermediate {posData[1].total || 0}, Advanced {posData[2].total || 0}, Pro {posData[3].total || 0}">
    function create_default_slot(ctx) {
    	let div3;
    	let div0;
    	let p;
    	let t0_value = /*name*/ ctx[1][/*i*/ ctx[5]] + "";
    	let t0;
    	let t1;
    	let div2;
    	let div1;
    	let t2_value = /*t*/ ctx[3].popularity + "";
    	let t2;
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = text("%");
    			t4 = space();
    			attr_dev(p, "text-align", "right");
    			add_location(p, file$5, 79, 14, 2712);
    			attr_dev(div0, "class", "label svelte-wc0dmo");
    			add_location(div0, file$5, 78, 12, 2677);
    			attr_dev(div1, "class", "bar val-" + [/*i*/ ctx[5]] + " svelte-wc0dmo");
    			set_style(div1, "flex-basis", Math.round(/*t*/ ctx[3].popularity / Math.max(.../*posData*/ ctx[0].map(func)) * 100) + "%");
    			add_location(div1, file$5, 84, 14, 2852);
    			attr_dev(div2, "class", "bar-container svelte-wc0dmo");
    			add_location(div2, file$5, 82, 12, 2795);
    			attr_dev(div3, "class", "row svelte-wc0dmo");
    			add_location(div3, file$5, 76, 8, 2632);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			insert_dev(target, t4, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posData*/ 1 && t2_value !== (t2_value = /*t*/ ctx[3].popularity + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*posData*/ 1) {
    				set_style(div1, "flex-basis", Math.round(/*t*/ ctx[3].popularity / Math.max(.../*posData*/ ctx[0].map(func)) * 100) + "%");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(76:6) <Tooltip title=\\\"Game counts: Beginner {posData[0].total || 0}, Intermediate {posData[1].total || 0}, Advanced {posData[2].total || 0}, Pro {posData[3].total || 0}\\\">",
    		ctx
    	});

    	return block;
    }

    // (75:6) {#each posData as t,i}
    function create_each_block$3(ctx) {
    	let tooltip;
    	let current;

    	tooltip = new Tooltip({
    			props: {
    				title: "Game counts: Beginner " + (/*posData*/ ctx[0][0].total || 0) + ", Intermediate " + (/*posData*/ ctx[0][1].total || 0) + ", Advanced " + (/*posData*/ ctx[0][2].total || 0) + ", Pro " + (/*posData*/ ctx[0][3].total || 0),
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip_changes = {};
    			if (dirty & /*posData*/ 1) tooltip_changes.title = "Game counts: Beginner " + (/*posData*/ ctx[0][0].total || 0) + ", Intermediate " + (/*posData*/ ctx[0][1].total || 0) + ", Advanced " + (/*posData*/ ctx[0][2].total || 0) + ", Pro " + (/*posData*/ ctx[0][3].total || 0);

    			if (dirty & /*$$scope, posData*/ 129) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(75:6) {#each posData as t,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div2;
    	let h10;
    	let t1;
    	let h30;
    	let t3;
    	let div0;
    	let t4;
    	let h11;
    	let t6;
    	let h31;
    	let t8;
    	let div1;
    	let current;
    	let each_value_1 = /*posData*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*posData*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Game Results by Experience Level";
    			t1 = space();
    			h30 = element("h3");
    			h30.textContent = "Eventual outcome for games that reach this position";
    			t3 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			h11 = element("h1");
    			h11.textContent = "Position Popularity by Experience Level";
    			t6 = space();
    			h31 = element("h3");
    			h31.textContent = "% of games that reach this position";
    			t8 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h10, file$5, 34, 4, 1259);
    			add_location(h30, file$5, 37, 4, 1323);
    			attr_dev(div0, "class", "container1 svelte-wc0dmo");
    			add_location(div0, file$5, 39, 2, 1389);
    			attr_dev(h11, "align", "center");
    			attr_dev(h11, "font-size", "28");
    			add_location(h11, file$5, 69, 4, 2253);
    			add_location(h31, file$5, 70, 4, 2340);
    			attr_dev(div1, "class", "container1 svelte-wc0dmo");
    			add_location(div1, file$5, 73, 4, 2394);
    			attr_dev(div2, "align", "center");
    			attr_dev(div2, "class", "container svelte-wc0dmo");
    			add_location(div2, file$5, 33, 0, 1215);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h10);
    			append_dev(div2, t1);
    			append_dev(div2, h30);
    			append_dev(div2, t3);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t4);
    			append_dev(div2, h11);
    			append_dev(div2, t6);
    			append_dev(div2, h31);
    			append_dev(div2, t8);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name, posData*/ 3) {
    				each_value_1 = /*posData*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*posData, Math, name*/ 3) {
    				each_value = /*posData*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = p => p.popularity;

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Current_viz', slots, []);
    	let name = ["Beginner", "Intermediate", "Advanced", "Pro"];
    	let posData = []; // Use this variable -- sincerely, Brett

    	const unsubscribeFen = fenDataStore.subscribe(new_fen => {
    		let gameTotal = [161763, 700261, 444771, 88547];

    		$$invalidate(0, posData = new_fen.map((level, i) => {
    			let g = [level.b, level.t, level.w];
    			let total = level.b + level.w + level.t;
    			let popularity = (total / gameTotal[i] * 100).toFixed(2);

    			// console.log({total,i})
    			return {
    				g,
    				bG: level.b,
    				b: Math.round(level.b / total * 100),
    				wG: level.w,
    				w: Math.round(level.w / total * 100),
    				tG: level.t,
    				t: Math.round(level.t / total * 100),
    				total,
    				popularity,
    				gameTotal
    			};
    		}));
    	});

    	onDestroy(unsubscribeFen); // prevent memory leak
    	console.table({ posData });
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Current_viz> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onDestroy,
    		fenDataStore,
    		initial_fen,
    		Hoverable: Tooltip,
    		fade,
    		fly,
    		Tooltip,
    		name,
    		posData,
    		unsubscribeFen
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('posData' in $$props) $$invalidate(0, posData = $$props.posData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [posData, name];
    }

    class Current_viz extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Current_viz",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    // color helpers
    function genColorIndex$1(i) {
        const colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f'];
        return colors[i % colors.length]
    }
    const pieceColoringMap = {
        'B': '#ffffb3',
        'N': '#bebada',
        'Q': '#fb8072',
        'R': '#80b1d3',
        'K': '#fdb462',
    };
    const pieceNameColors = [
        ['Bishop', '#ffffb3'],
        ['Knight', '#bebada'],
        ['Queen', '#fb8072'],
        ['Rook', '#80b1d3'],
        ['King', '#fdb462'],
        ['Pawn', '#b3de69']
    ];
    function genColorPiece(san) {
        // get piece char from beginning of san
        return pieceColoringMap[san[0]] || '#b3de69';  // if not defined, use pawn color
    }
    function genColor({i, san}) {
        if (san) return genColorPiece(san);
        else return genColorIndex$1(i);
    }

    /* src\components\futureViz\stacked_bar.svelte generated by Svelte v3.46.4 */
    const file$4 = "src\\components\\futureViz\\stacked_bar.svelte";

    // (39:4) {#if count/nextMovesTotal*h > 20}
    function create_if_block$2(ctx) {
    	let text_1;
    	let t;
    	let text_1_transform_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(/*san*/ ctx[5]);
    			attr_dev(text_1, "transform", text_1_transform_value = "translate(18," + ((/*accCount*/ ctx[6] - /*count*/ ctx[7] + /*count*/ ctx[7] / 2) * /*h*/ ctx[9] / /*nextMovesTotal*/ ctx[4] + 5) + ")");
    			add_location(text_1, file$4, 40, 8, 1211);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*san*/ 32) set_data_dev(t, /*san*/ ctx[5]);

    			if (dirty & /*accCount, count, nextMovesTotal*/ 208 && text_1_transform_value !== (text_1_transform_value = "translate(18," + ((/*accCount*/ ctx[6] - /*count*/ ctx[7] + /*count*/ ctx[7] / 2) * /*h*/ ctx[9] / /*nextMovesTotal*/ ctx[4] + 5) + ")")) {
    				attr_dev(text_1, "transform", text_1_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(39:4) {#if count/nextMovesTotal*h > 20}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let g;
    	let rect;
    	let rect_height_value;
    	let rect_transform_value;
    	let rect_fill_value;
    	let rect_stroke_value;
    	let g_id_value;
    	let mounted;
    	let dispose;
    	let if_block = /*count*/ ctx[7] / /*nextMovesTotal*/ ctx[4] * /*h*/ ctx[9] > 20 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			rect = svg_element("rect");
    			if (if_block) if_block.c();
    			attr_dev(rect, "width", /*bw*/ ctx[10]);
    			attr_dev(rect, "height", rect_height_value = /*count*/ ctx[7] / /*nextMovesTotal*/ ctx[4] * /*h*/ ctx[9]);
    			attr_dev(rect, "transform", rect_transform_value = "translate(0," + (/*accCount*/ ctx[6] - /*count*/ ctx[7]) / /*nextMovesTotal*/ ctx[4] * /*h*/ ctx[9] + ")");

    			attr_dev(rect, "fill", rect_fill_value = /*$colorByPieceStore*/ ctx[8]
    			? genColor({ san: /*san*/ ctx[5] })
    			: genColor({ i: /*i*/ ctx[0] }));

    			attr_dev(rect, "stroke", rect_stroke_value = /*$colorByPieceStore*/ ctx[8] ? 'black' : undefined);
    			add_location(rect, file$4, 33, 4, 842);
    			attr_dev(g, "id", g_id_value = `bar-${/*san*/ ctx[5]}`);
    			attr_dev(g, "class", "bar svelte-q2qqok");
    			add_location(g, file$4, 28, 0, 687);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, rect);
    			if (if_block) if_block.m(g, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(g, "mouseenter", /*mouseenter_handler*/ ctx[13], false, false, false),
    					listen_dev(
    						g,
    						"mouseleave",
    						function () {
    							if (is_function(/*hideTooltip*/ ctx[2])) /*hideTooltip*/ ctx[2].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(g, "click", /*barClicked*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*count, nextMovesTotal*/ 144 && rect_height_value !== (rect_height_value = /*count*/ ctx[7] / /*nextMovesTotal*/ ctx[4] * /*h*/ ctx[9])) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty & /*accCount, count, nextMovesTotal*/ 208 && rect_transform_value !== (rect_transform_value = "translate(0," + (/*accCount*/ ctx[6] - /*count*/ ctx[7]) / /*nextMovesTotal*/ ctx[4] * /*h*/ ctx[9] + ")")) {
    				attr_dev(rect, "transform", rect_transform_value);
    			}

    			if (dirty & /*$colorByPieceStore, san, i*/ 289 && rect_fill_value !== (rect_fill_value = /*$colorByPieceStore*/ ctx[8]
    			? genColor({ san: /*san*/ ctx[5] })
    			: genColor({ i: /*i*/ ctx[0] }))) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}

    			if (dirty & /*$colorByPieceStore*/ 256 && rect_stroke_value !== (rect_stroke_value = /*$colorByPieceStore*/ ctx[8] ? 'black' : undefined)) {
    				attr_dev(rect, "stroke", rect_stroke_value);
    			}

    			if (/*count*/ ctx[7] / /*nextMovesTotal*/ ctx[4] * /*h*/ ctx[9] > 20) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(g, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*san*/ 32 && g_id_value !== (g_id_value = `bar-${/*san*/ ctx[5]}`)) {
    				attr_dev(g, "id", g_id_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let fen;
    	let count;
    	let accCount;
    	let san;
    	let $colorByPieceStore;
    	validate_store(colorByPieceStore, 'colorByPieceStore');
    	component_subscribe($$self, colorByPieceStore, $$value => $$invalidate(8, $colorByPieceStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Stacked_bar', slots, []);
    	let { i } = $$props;
    	let { data } = $$props;
    	let { hideTooltip, showTooltip } = $$props;
    	let { nextMovesTotal } = $$props;
    	let { sizing } = $$props;
    	let tstbool = true;
    	const interval = setInterval(() => tstbool = !tstbool, 500);
    	onDestroy(() => clearInterval(interval));
    	const { w, h, bw } = sizing;

    	function barClicked() {
    		curr_fen.set(fen);
    		hideTooltip();
    	}

    	const writable_props = ['i', 'data', 'hideTooltip', 'showTooltip', 'nextMovesTotal', 'sizing'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Stacked_bar> was created with unknown prop '${key}'`);
    	});

    	const mouseenter_handler = evt => showTooltip(evt, data);

    	$$self.$$set = $$props => {
    		if ('i' in $$props) $$invalidate(0, i = $$props.i);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('hideTooltip' in $$props) $$invalidate(2, hideTooltip = $$props.hideTooltip);
    		if ('showTooltip' in $$props) $$invalidate(3, showTooltip = $$props.showTooltip);
    		if ('nextMovesTotal' in $$props) $$invalidate(4, nextMovesTotal = $$props.nextMovesTotal);
    		if ('sizing' in $$props) $$invalidate(12, sizing = $$props.sizing);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		colorByPieceStore,
    		curr_fen,
    		genColor,
    		i,
    		data,
    		hideTooltip,
    		showTooltip,
    		nextMovesTotal,
    		sizing,
    		tstbool,
    		interval,
    		w,
    		h,
    		bw,
    		barClicked,
    		fen,
    		san,
    		accCount,
    		count,
    		$colorByPieceStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('i' in $$props) $$invalidate(0, i = $$props.i);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('hideTooltip' in $$props) $$invalidate(2, hideTooltip = $$props.hideTooltip);
    		if ('showTooltip' in $$props) $$invalidate(3, showTooltip = $$props.showTooltip);
    		if ('nextMovesTotal' in $$props) $$invalidate(4, nextMovesTotal = $$props.nextMovesTotal);
    		if ('sizing' in $$props) $$invalidate(12, sizing = $$props.sizing);
    		if ('tstbool' in $$props) tstbool = $$props.tstbool;
    		if ('fen' in $$props) fen = $$props.fen;
    		if ('san' in $$props) $$invalidate(5, san = $$props.san);
    		if ('accCount' in $$props) $$invalidate(6, accCount = $$props.accCount);
    		if ('count' in $$props) $$invalidate(7, count = $$props.count);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data*/ 2) {
    			$$invalidate(7, { fen, count, accCount, san } = data, count, ($$invalidate(6, accCount), $$invalidate(1, data)), ($$invalidate(5, san), $$invalidate(1, data)));
    		}
    	};

    	return [
    		i,
    		data,
    		hideTooltip,
    		showTooltip,
    		nextMovesTotal,
    		san,
    		accCount,
    		count,
    		$colorByPieceStore,
    		h,
    		bw,
    		barClicked,
    		sizing,
    		mouseenter_handler
    	];
    }

    class Stacked_bar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			i: 0,
    			data: 1,
    			hideTooltip: 2,
    			showTooltip: 3,
    			nextMovesTotal: 4,
    			sizing: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Stacked_bar",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*i*/ ctx[0] === undefined && !('i' in props)) {
    			console.warn("<Stacked_bar> was created without expected prop 'i'");
    		}

    		if (/*data*/ ctx[1] === undefined && !('data' in props)) {
    			console.warn("<Stacked_bar> was created without expected prop 'data'");
    		}

    		if (/*hideTooltip*/ ctx[2] === undefined && !('hideTooltip' in props)) {
    			console.warn("<Stacked_bar> was created without expected prop 'hideTooltip'");
    		}

    		if (/*showTooltip*/ ctx[3] === undefined && !('showTooltip' in props)) {
    			console.warn("<Stacked_bar> was created without expected prop 'showTooltip'");
    		}

    		if (/*nextMovesTotal*/ ctx[4] === undefined && !('nextMovesTotal' in props)) {
    			console.warn("<Stacked_bar> was created without expected prop 'nextMovesTotal'");
    		}

    		if (/*sizing*/ ctx[12] === undefined && !('sizing' in props)) {
    			console.warn("<Stacked_bar> was created without expected prop 'sizing'");
    		}
    	}

    	get i() {
    		throw new Error("<Stacked_bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set i(value) {
    		throw new Error("<Stacked_bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Stacked_bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Stacked_bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideTooltip() {
    		throw new Error("<Stacked_bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideTooltip(value) {
    		throw new Error("<Stacked_bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showTooltip() {
    		throw new Error("<Stacked_bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showTooltip(value) {
    		throw new Error("<Stacked_bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesTotal() {
    		throw new Error("<Stacked_bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesTotal(value) {
    		throw new Error("<Stacked_bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sizing() {
    		throw new Error("<Stacked_bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sizing(value) {
    		throw new Error("<Stacked_bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\futureViz\next_move_graph.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\components\\futureViz\\next_move_graph.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	child_ctx[29] = i;
    	return child_ctx;
    }

    // (64:4) {#each paths.reverse() as path, i_p}
    function create_each_block$2(ctx) {
    	let path;
    	let path_d_value;
    	let path_stroke_value;
    	let path_stroke_width_value;
    	let path_transition;
    	let current;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = `M${/*path*/ ctx[27].x1},${/*path*/ ctx[27].y1} C0${/*w*/ ctx[2]},${/*path*/ ctx[27].y1} 0,${/*path*/ ctx[27].y2} ${/*path*/ ctx[27].x2},${/*path*/ ctx[27].y2}`);
    			attr_dev(path, "fill", "none");
    			attr_dev(path, "stroke", path_stroke_value = /*color*/ ctx[3](/*path*/ ctx[27]));
    			attr_dev(path, "stroke-width", path_stroke_width_value = /*path*/ ctx[27].t);
    			add_location(path, file$3, 65, 8, 2344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*paths*/ 1 && path_d_value !== (path_d_value = `M${/*path*/ ctx[27].x1},${/*path*/ ctx[27].y1} C0${/*w*/ ctx[2]},${/*path*/ ctx[27].y1} 0,${/*path*/ ctx[27].y2} ${/*path*/ ctx[27].x2},${/*path*/ ctx[27].y2}`)) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (!current || dirty & /*paths*/ 1 && path_stroke_value !== (path_stroke_value = /*color*/ ctx[3](/*path*/ ctx[27]))) {
    				attr_dev(path, "stroke", path_stroke_value);
    			}

    			if (!current || dirty & /*paths*/ 1 && path_stroke_width_value !== (path_stroke_width_value = /*path*/ ctx[27].t)) {
    				attr_dev(path, "stroke-width", path_stroke_width_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!path_transition) path_transition = create_bidirectional_transition(
    					path,
    					draw,
    					{
    						duration: 300,
    						delay: (/*paths*/ ctx[0].length - /*i_p*/ ctx[29]) * 100
    					},
    					true
    				);

    				path_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!path_transition) path_transition = create_bidirectional_transition(
    				path,
    				draw,
    				{
    					duration: 300,
    					delay: (/*paths*/ ctx[0].length - /*i_p*/ ctx[29]) * 100
    				},
    				false
    			);

    			path_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    			if (detaching && path_transition) path_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(64:4) {#each paths.reverse() as path, i_p}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let g;
    	let g_id_value;
    	let current;
    	let each_value = /*paths*/ ctx[0].reverse();
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "id", g_id_value = `bar-${/*san*/ ctx[1]}`);
    			attr_dev(g, "class", "bar svelte-1uesnla");
    			add_location(g, file$3, 62, 0, 2196);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*paths, w, color*/ 13) {
    				each_value = /*paths*/ ctx[0].reverse();
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(g, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*san*/ 2 && g_id_value !== (g_id_value = `bar-${/*san*/ ctx[1]}`)) {
    				attr_dev(g, "id", g_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function genColorIndex(i) {
    	const colors = [
    		'#8dd3c7',
    		'#ffffb3',
    		'#bebada',
    		'#fb8072',
    		'#80b1d3',
    		'#fdb462',
    		'#b3de69',
    		'#fccde5',
    		'#bc80bd',
    		'#ccebc5',
    		'#ffed6f'
    	];

    	return colors[i % colors.length];
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let san;
    	let count;
    	let fen;
    	let accCount;
    	let curves;
    	let vc_selected;
    	let barHeight;
    	let paths;
    	let $colorByPieceStore;
    	validate_store(colorByPieceStore, 'colorByPieceStore');
    	component_subscribe($$self, colorByPieceStore, $$value => $$invalidate(18, $colorByPieceStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Next_move_graph', slots, []);
    	let { tooltipData } = $$props;
    	let { nextMovesTotal } = $$props;
    	let { aggNextMove } = $$props;
    	let { nextMovesArr } = $$props;
    	let { nextMovesTotal2 } = $$props;
    	let { aggNextMove2 } = $$props;
    	let { nextMovesArr2 } = $$props;
    	let { sizing } = $$props;
    	const { w, h, bw, th } = sizing;

    	const colors = [
    		'#3d5599',
    		'#ffe',
    		'#f44',
    		'#f1e',
    		'#ee1',
    		'#3d5599',
    		'#ffe',
    		'#f44',
    		'#f1e',
    		'#ee1',
    		'#3d5599',
    		'#ffe',
    		'#f44',
    		'#f1e',
    		'#ee1'
    	];

    	function calcVertCent(acc, cnt, total) {
    		// calculate vertical center
    		return (acc - cnt + cnt / 2) * h / total + th;
    	}

    	const xmin = bw;
    	const xmax = w - bw;

    	function color(path) {
    		if (path.c) return path.c; // if given color
    		if ($colorByPieceStore) return genColor({ san: path.san });
    		return genColor({ i: path.i });
    	}

    	function genColorPiece(san) {
    		// get piece char from beginning of san
    		const colors = {
    			'B': '#ffffb3',
    			'N': '#bebada',
    			'Q': '#fb8072',
    			'R': '#80b1d3',
    			'K': '#fdb462'
    		};

    		if (san[0] in colors) return colors[san[0]];
    		return '#b3de69'; // for pawns
    	}

    	const writable_props = [
    		'tooltipData',
    		'nextMovesTotal',
    		'aggNextMove',
    		'nextMovesArr',
    		'nextMovesTotal2',
    		'aggNextMove2',
    		'nextMovesArr2',
    		'sizing'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Next_move_graph> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('tooltipData' in $$props) $$invalidate(4, tooltipData = $$props.tooltipData);
    		if ('nextMovesTotal' in $$props) $$invalidate(5, nextMovesTotal = $$props.nextMovesTotal);
    		if ('aggNextMove' in $$props) $$invalidate(6, aggNextMove = $$props.aggNextMove);
    		if ('nextMovesArr' in $$props) $$invalidate(7, nextMovesArr = $$props.nextMovesArr);
    		if ('nextMovesTotal2' in $$props) $$invalidate(8, nextMovesTotal2 = $$props.nextMovesTotal2);
    		if ('aggNextMove2' in $$props) $$invalidate(9, aggNextMove2 = $$props.aggNextMove2);
    		if ('nextMovesArr2' in $$props) $$invalidate(10, nextMovesArr2 = $$props.nextMovesArr2);
    		if ('sizing' in $$props) $$invalidate(11, sizing = $$props.sizing);
    	};

    	$$self.$capture_state = () => ({
    		draw,
    		quintOut,
    		colorByPieceStore,
    		genColor,
    		tooltipData,
    		nextMovesTotal,
    		aggNextMove,
    		nextMovesArr,
    		nextMovesTotal2,
    		aggNextMove2,
    		nextMovesArr2,
    		sizing,
    		w,
    		h,
    		bw,
    		th,
    		colors,
    		calcVertCent,
    		xmin,
    		xmax,
    		color,
    		genColorIndex,
    		genColorPiece,
    		curves,
    		paths,
    		count,
    		barHeight,
    		accCount,
    		vc_selected,
    		fen,
    		san,
    		$colorByPieceStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('tooltipData' in $$props) $$invalidate(4, tooltipData = $$props.tooltipData);
    		if ('nextMovesTotal' in $$props) $$invalidate(5, nextMovesTotal = $$props.nextMovesTotal);
    		if ('aggNextMove' in $$props) $$invalidate(6, aggNextMove = $$props.aggNextMove);
    		if ('nextMovesArr' in $$props) $$invalidate(7, nextMovesArr = $$props.nextMovesArr);
    		if ('nextMovesTotal2' in $$props) $$invalidate(8, nextMovesTotal2 = $$props.nextMovesTotal2);
    		if ('aggNextMove2' in $$props) $$invalidate(9, aggNextMove2 = $$props.aggNextMove2);
    		if ('nextMovesArr2' in $$props) $$invalidate(10, nextMovesArr2 = $$props.nextMovesArr2);
    		if ('sizing' in $$props) $$invalidate(11, sizing = $$props.sizing);
    		if ('curves' in $$props) $$invalidate(12, curves = $$props.curves);
    		if ('paths' in $$props) $$invalidate(0, paths = $$props.paths);
    		if ('count' in $$props) $$invalidate(13, count = $$props.count);
    		if ('barHeight' in $$props) barHeight = $$props.barHeight;
    		if ('accCount' in $$props) $$invalidate(14, accCount = $$props.accCount);
    		if ('vc_selected' in $$props) vc_selected = $$props.vc_selected;
    		if ('fen' in $$props) fen = $$props.fen;
    		if ('san' in $$props) $$invalidate(1, san = $$props.san);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*tooltipData*/ 16) {
    			$$invalidate(1, { san, count, fen, accCount, curves } = tooltipData, san, ($$invalidate(13, count), $$invalidate(4, tooltipData)), ($$invalidate(14, accCount), $$invalidate(4, tooltipData)), ($$invalidate(12, curves), $$invalidate(4, tooltipData)));
    		}

    		if ($$self.$$.dirty & /*accCount, count, nextMovesTotal*/ 24608) {
    			vc_selected = calcVertCent(accCount, count, nextMovesTotal);
    		}

    		if ($$self.$$.dirty & /*count, nextMovesTotal*/ 8224) {
    			barHeight = count / nextMovesTotal * h;
    		}

    		if ($$self.$$.dirty & /*curves*/ 4096) {
    			// example of path curves
    			// [ 
    			//     {x1: xmin, y1: vertical_center, x2:xmax, y2: vertical_center, t: count, c:'blue'},
    			//     {x1: xmin, y1: vertical_center, x2:xmax, y2: vertical_center/2, t: (nextMovesTotal-count)*2/3, c:'yellow'},
    			//     {x1: xmin, y1: vertical_center, x2:xmax, y2: vertical_center*2, t: (nextMovesTotal-count)*1/3, c:'green'},
    			// ];
    			$$invalidate(0, paths = curves);
    		}
    	};

    	return [
    		paths,
    		san,
    		w,
    		color,
    		tooltipData,
    		nextMovesTotal,
    		aggNextMove,
    		nextMovesArr,
    		nextMovesTotal2,
    		aggNextMove2,
    		nextMovesArr2,
    		sizing,
    		curves,
    		count,
    		accCount
    	];
    }

    class Next_move_graph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			tooltipData: 4,
    			nextMovesTotal: 5,
    			aggNextMove: 6,
    			nextMovesArr: 7,
    			nextMovesTotal2: 8,
    			aggNextMove2: 9,
    			nextMovesArr2: 10,
    			sizing: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Next_move_graph",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tooltipData*/ ctx[4] === undefined && !('tooltipData' in props)) {
    			console.warn("<Next_move_graph> was created without expected prop 'tooltipData'");
    		}

    		if (/*nextMovesTotal*/ ctx[5] === undefined && !('nextMovesTotal' in props)) {
    			console.warn("<Next_move_graph> was created without expected prop 'nextMovesTotal'");
    		}

    		if (/*aggNextMove*/ ctx[6] === undefined && !('aggNextMove' in props)) {
    			console.warn("<Next_move_graph> was created without expected prop 'aggNextMove'");
    		}

    		if (/*nextMovesArr*/ ctx[7] === undefined && !('nextMovesArr' in props)) {
    			console.warn("<Next_move_graph> was created without expected prop 'nextMovesArr'");
    		}

    		if (/*nextMovesTotal2*/ ctx[8] === undefined && !('nextMovesTotal2' in props)) {
    			console.warn("<Next_move_graph> was created without expected prop 'nextMovesTotal2'");
    		}

    		if (/*aggNextMove2*/ ctx[9] === undefined && !('aggNextMove2' in props)) {
    			console.warn("<Next_move_graph> was created without expected prop 'aggNextMove2'");
    		}

    		if (/*nextMovesArr2*/ ctx[10] === undefined && !('nextMovesArr2' in props)) {
    			console.warn("<Next_move_graph> was created without expected prop 'nextMovesArr2'");
    		}

    		if (/*sizing*/ ctx[11] === undefined && !('sizing' in props)) {
    			console.warn("<Next_move_graph> was created without expected prop 'sizing'");
    		}
    	}

    	get tooltipData() {
    		throw new Error("<Next_move_graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipData(value) {
    		throw new Error("<Next_move_graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesTotal() {
    		throw new Error("<Next_move_graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesTotal(value) {
    		throw new Error("<Next_move_graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get aggNextMove() {
    		throw new Error("<Next_move_graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aggNextMove(value) {
    		throw new Error("<Next_move_graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesArr() {
    		throw new Error("<Next_move_graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesArr(value) {
    		throw new Error("<Next_move_graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesTotal2() {
    		throw new Error("<Next_move_graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesTotal2(value) {
    		throw new Error("<Next_move_graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get aggNextMove2() {
    		throw new Error("<Next_move_graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aggNextMove2(value) {
    		throw new Error("<Next_move_graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesArr2() {
    		throw new Error("<Next_move_graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesArr2(value) {
    		throw new Error("<Next_move_graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sizing() {
    		throw new Error("<Next_move_graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sizing(value) {
    		throw new Error("<Next_move_graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\futureViz\parallel_axis_stacked_bars.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1$1, console: console_1$1 } = globals;
    const file$2 = "src\\components\\futureViz\\parallel_axis_stacked_bars.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    // (132:12) {:else}
    function create_else_block_1(ctx) {
    	let text_1;
    	let t;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text("No games found");
    			attr_dev(text_1, "transform", "translate(30,20)");
    			attr_dev(text_1, "class", "svelte-lhg3t6");
    			add_location(text_1, file$2, 132, 16, 5276);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(132:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (127:12) {#if nextMovesArr2.length > 0}
    function create_if_block_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*nextMovesArr*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*nextMovesArr, sizing, nextMovesTotal, hideTooltip, showTooltip*/ 7174) {
    				each_value_1 = /*nextMovesArr*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(127:12) {#if nextMovesArr2.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (128:16) {#each nextMovesArr as data, i}
    function create_each_block_1(ctx) {
    	let stackedbar;
    	let current;

    	stackedbar = new Stacked_bar({
    			props: {
    				data: /*data*/ ctx[18],
    				i: /*i*/ ctx[20],
    				sizing: /*sizing*/ ctx[12],
    				nextMovesTotal: /*nextMovesTotal*/ ctx[2],
    				hideTooltip: /*hideTooltip*/ ctx[11],
    				showTooltip: /*showTooltip*/ ctx[10]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stackedbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stackedbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stackedbar_changes = {};
    			if (dirty & /*nextMovesArr*/ 2) stackedbar_changes.data = /*data*/ ctx[18];
    			if (dirty & /*nextMovesTotal*/ 4) stackedbar_changes.nextMovesTotal = /*nextMovesTotal*/ ctx[2];
    			stackedbar.$set(stackedbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stackedbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(128:16) {#each nextMovesArr as data, i}",
    		ctx
    	});

    	return block;
    }

    // (146:12) {:else}
    function create_else_block(ctx) {
    	let text_1;
    	let t;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text("No games found");
    			attr_dev(text_1, "transform", "translate(-60,20)");
    			attr_dev(text_1, "class", "svelte-lhg3t6");
    			add_location(text_1, file$2, 146, 16, 5822);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(146:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (139:12) {#if nextMovesArr2.length > 0}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*nextMovesArr2*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*nextMovesArr2, sizing, nextMovesTotal2, hideTooltip, showTooltip*/ 7216) {
    				each_value = /*nextMovesArr2*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(139:12) {#if nextMovesArr2.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (140:16) {#each nextMovesArr2 as data, i}
    function create_each_block$1(ctx) {
    	let stackedbar;
    	let current;

    	stackedbar = new Stacked_bar({
    			props: {
    				data: /*data*/ ctx[18],
    				i: /*i*/ ctx[20],
    				sizing: /*sizing*/ ctx[12],
    				nextMovesTotal: /*nextMovesTotal2*/ ctx[5],
    				hideTooltip: /*hideTooltip*/ ctx[11],
    				showTooltip: /*showTooltip*/ ctx[10]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stackedbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stackedbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stackedbar_changes = {};
    			if (dirty & /*nextMovesArr2*/ 16) stackedbar_changes.data = /*data*/ ctx[18];
    			if (dirty & /*nextMovesTotal2*/ 32) stackedbar_changes.nextMovesTotal = /*nextMovesTotal2*/ ctx[5];
    			stackedbar.$set(stackedbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stackedbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(140:16) {#each nextMovesArr2 as data, i}",
    		ctx
    	});

    	return block;
    }

    // (151:4) {#if tooltipIsShown}
    function create_if_block_1(ctx) {
    	let nextmovegraph;
    	let text_1;
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let current;

    	nextmovegraph = new Next_move_graph({
    			props: {
    				sizing: /*sizing*/ ctx[12],
    				tooltipData: /*tooltipData*/ ctx[9],
    				aggNextMove: /*aggNextMove*/ ctx[0],
    				nextMovesArr: /*nextMovesArr*/ ctx[1],
    				nextMovesTotal: /*nextMovesTotal*/ ctx[2],
    				aggNextMove2: /*aggNextMove2*/ ctx[3],
    				nextMovesArr2: /*nextMovesArr2*/ ctx[4],
    				nextMovesTotal2: /*nextMovesTotal2*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nextmovegraph.$$.fragment);
    			text_1 = svg_element("text");
    			t = text("Other Move(s)");
    			attr_dev(text_1, "x", text_1_x_value = /*w*/ ctx[7] / 2 - 20);
    			attr_dev(text_1, "y", text_1_y_value = /*h*/ ctx[6] + 18);
    			attr_dev(text_1, "class", "svelte-lhg3t6");
    			add_location(text_1, file$2, 155, 8, 6139);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nextmovegraph, target, anchor);
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nextmovegraph_changes = {};
    			if (dirty & /*tooltipData*/ 512) nextmovegraph_changes.tooltipData = /*tooltipData*/ ctx[9];
    			if (dirty & /*aggNextMove*/ 1) nextmovegraph_changes.aggNextMove = /*aggNextMove*/ ctx[0];
    			if (dirty & /*nextMovesArr*/ 2) nextmovegraph_changes.nextMovesArr = /*nextMovesArr*/ ctx[1];
    			if (dirty & /*nextMovesTotal*/ 4) nextmovegraph_changes.nextMovesTotal = /*nextMovesTotal*/ ctx[2];
    			if (dirty & /*aggNextMove2*/ 8) nextmovegraph_changes.aggNextMove2 = /*aggNextMove2*/ ctx[3];
    			if (dirty & /*nextMovesArr2*/ 16) nextmovegraph_changes.nextMovesArr2 = /*nextMovesArr2*/ ctx[4];
    			if (dirty & /*nextMovesTotal2*/ 32) nextmovegraph_changes.nextMovesTotal2 = /*nextMovesTotal2*/ ctx[5];
    			nextmovegraph.$set(nextmovegraph_changes);

    			if (!current || dirty & /*w*/ 128 && text_1_x_value !== (text_1_x_value = /*w*/ ctx[7] / 2 - 20)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (!current || dirty & /*h*/ 64 && text_1_y_value !== (text_1_y_value = /*h*/ ctx[6] + 18)) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nextmovegraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nextmovegraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nextmovegraph, detaching);
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(151:4) {#if tooltipIsShown}",
    		ctx
    	});

    	return block;
    }

    // (159:0) {#if true}
    function create_if_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", "tooltip");
    			attr_dev(div, "display", "none");
    			set_style(div, "position", "absolute");
    			set_style(div, "display", "none");
    			attr_dev(div, "class", "svelte-lhg3t6");
    			add_location(div, file$2, 159, 4, 6222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(159:0) {#if true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let current_block_type_index;
    	let if_block0;
    	let g3;
    	let g2;
    	let current_block_type_index_1;
    	let if_block1;
    	let g3_transform_value;
    	let svg_height_value;
    	let t;
    	let if_block3_anchor;
    	let current;
    	const if_block_creators = [create_if_block_3, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nextMovesArr2*/ ctx[4].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block_2, create_else_block];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*nextMovesArr2*/ ctx[4].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	let if_block2 = /*tooltipIsShown*/ ctx[8] && create_if_block_1(ctx);
    	let if_block3 = create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			if_block0.c();
    			g3 = svg_element("g");
    			g2 = svg_element("g");
    			if_block1.c();
    			if (if_block2) if_block2.c();
    			t = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			attr_dev(g0, "transform", "translate(0," + /*th*/ ctx[13] + ")");
    			add_location(g0, file$2, 125, 8, 4952);
    			attr_dev(g1, "class", "bars-1");
    			add_location(g1, file$2, 124, 4, 4924);
    			attr_dev(g2, "transform", "translate(0," + /*th*/ ctx[13] + ")");
    			add_location(g2, file$2, 137, 8, 5441);
    			attr_dev(g3, "class", "bars-2");
    			attr_dev(g3, "transform", g3_transform_value = "translate(" + (/*w*/ ctx[7] - /*bw*/ ctx[14]) + ",0)");
    			add_location(g3, file$2, 136, 4, 5381);
    			attr_dev(svg, "width", /*w*/ ctx[7]);
    			attr_dev(svg, "height", svg_height_value = /*h*/ ctx[6] + 20);
    			attr_dev(svg, "class", "svelte-lhg3t6");
    			add_location(svg, file$2, 123, 0, 4888);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			if_blocks[current_block_type_index].m(g0, null);
    			append_dev(svg, g3);
    			append_dev(g3, g2);
    			if_blocks_1[current_block_type_index_1].m(g2, null);
    			if (if_block2) if_block2.m(svg, null);
    			insert_dev(target, t, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(g0, null);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(g2, null);
    			}

    			if (!current || dirty & /*w*/ 128 && g3_transform_value !== (g3_transform_value = "translate(" + (/*w*/ ctx[7] - /*bw*/ ctx[14]) + ",0)")) {
    				attr_dev(g3, "transform", g3_transform_value);
    			}

    			if (/*tooltipIsShown*/ ctx[8]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*tooltipIsShown*/ 256) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(svg, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*w*/ 128) {
    				attr_dev(svg, "width", /*w*/ ctx[7]);
    			}

    			if (!current || dirty & /*h*/ 64 && svg_height_value !== (svg_height_value = /*h*/ ctx[6] + 20)) {
    				attr_dev(svg, "height", svg_height_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if_blocks[current_block_type_index].d();
    			if_blocks_1[current_block_type_index_1].d();
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $gameDataStore;
    	validate_store(gameDataStore, 'gameDataStore');
    	component_subscribe($$self, gameDataStore, $$value => $$invalidate(17, $gameDataStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Parallel_axis_stacked_bars', slots, []);
    	let { aggNextMove } = $$props;
    	let { nextMovesArr } = $$props;
    	let { nextMovesArrDict } = $$props;
    	let { nextMovesTotal } = $$props;
    	let { aggNextMove2 } = $$props;
    	let { nextMovesArr2 } = $$props;
    	let { nextMovesTotal2 } = $$props;
    	let { nextMovesArrDict2 } = $$props;
    	let { h } = $$props;
    	let { w } = $$props;
    	let tooltipIsShown;
    	let tooltipData;

    	function showTooltip(evt, { san, count, fen, accCount, prevFens }) {
    		selectedSquare.set(san.slice(-2));
    		let tooltip = document.getElementById("tooltip");
    		tooltip.innerHTML = `${san} was played ${count} times (${Math.round(count / nextMovesTotal * 100)}%)`;
    		tooltip.style.display = "block";
    		tooltip.style.left = evt.pageX + 10 + 'px';
    		tooltip.style.top = evt.pageY + 10 + 'px';
    		let curves;
    		const xmin = bw;
    		const xmax = w - bw;
    		const vc = (acc, cnt, total) => (acc - cnt / 2) * h / total + th; // vertical center

    		if (prevFens) {
    			// two move bar is selected
    			const vCentCurr = vc(accCount, count, nextMovesTotal2);

    			curves = Object.entries(prevFens).map(([prevFen, countPrevFen]) => {
    				const { accCount: accCntNxt, count: cntNxt, san, i } = nextMovesArrDict[prevFen];

    				//console.log({prevFen, aggNextMove});
    				const vCentNext = vc(accCntNxt, cntNxt, nextMovesTotal); // vertical center of previous move

    				return {
    					x1: xmin,
    					x2: xmax,
    					y1: vCentNext,
    					y2: vCentCurr,
    					san,
    					i,
    					t: countPrevFen / nextMovesTotal2 * h
    				};
    			});

    			curves.push({
    				x1: xmin,
    				x2: xmax / 2,
    				y1: vOffset,
    				y2: h - thickness / 2,
    				t: thickness,
    				c: 'darkgray'
    			});
    		} else {
    			// next move bar selected
    			// need list of next fens
    			const fullFenDataNxtDup = ['0', '1', '2', '3'].reduce(
    				(acc, level) => {
    					const nxtFensAtLvl = $gameDataStore[level][fen]['nxt'].map(e => e[0]);
    					return [...acc, ...nxtFensAtLvl];
    				},
    				[]
    			);

    			const nxtFenList = [...new Set(fullFenDataNxtDup)];

    			let vOffsetAcc = accCount - count; // vertical offset accumulator (avoid overlap in start)
    			let acc = 0;

    			curves = nxtFenList.map((nxtFen, i) => {
    				const nxt = nextMovesArrDict2[nxtFen];

    				//console.log({nxtFen, nxt})
    				const thickness = nxt['count'] / nextMovesTotal2 * h;

    				const vCentNext = vc(nxt['accCount'], nxt['count'], nextMovesTotal2);
    				const vOffset = vOffsetAcc * h / nextMovesTotal + thickness / 2;
    				vOffsetAcc += nxt['count'];
    				acc += nxt['count'];

    				return {
    					x1: xmin,
    					x2: xmax,
    					y1: vOffset,
    					y2: vCentNext,
    					t: thickness,
    					san: nxt['san'],
    					i: nxt['i']
    				};
    			});

    			// "other" line
    			const thickness = (count - acc) / nextMovesTotal * h;

    			const y1 = accCount * h / nextMovesTotal - thickness / 2;

    			curves.push({
    				x1: xmin,
    				x2: xmax / 2,
    				y1,
    				y2: h + 20 - thickness / 2,
    				t: thickness,
    				c: 'gray'
    			});
    		}

    		$$invalidate(9, tooltipData = {
    			san,
    			count,
    			fen,
    			accCount,
    			prevFens,
    			curves
    		});

    		console.log({ tooltipData });
    		$$invalidate(8, tooltipIsShown = true);
    	}

    	function hideTooltip() {
    		selectedSquare.set(false);
    		var tooltip = document.getElementById("tooltip");
    		tooltip.style.display = "none";
    		$$invalidate(8, tooltipIsShown = false);
    	}

    	const sizing = {
    		w,
    		bw: 50,
    		h,
    		th: 0, // title height
    		
    	};

    	const { th, bw } = sizing; // overall width

    	const writable_props = [
    		'aggNextMove',
    		'nextMovesArr',
    		'nextMovesArrDict',
    		'nextMovesTotal',
    		'aggNextMove2',
    		'nextMovesArr2',
    		'nextMovesTotal2',
    		'nextMovesArrDict2',
    		'h',
    		'w'
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Parallel_axis_stacked_bars> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('aggNextMove' in $$props) $$invalidate(0, aggNextMove = $$props.aggNextMove);
    		if ('nextMovesArr' in $$props) $$invalidate(1, nextMovesArr = $$props.nextMovesArr);
    		if ('nextMovesArrDict' in $$props) $$invalidate(15, nextMovesArrDict = $$props.nextMovesArrDict);
    		if ('nextMovesTotal' in $$props) $$invalidate(2, nextMovesTotal = $$props.nextMovesTotal);
    		if ('aggNextMove2' in $$props) $$invalidate(3, aggNextMove2 = $$props.aggNextMove2);
    		if ('nextMovesArr2' in $$props) $$invalidate(4, nextMovesArr2 = $$props.nextMovesArr2);
    		if ('nextMovesTotal2' in $$props) $$invalidate(5, nextMovesTotal2 = $$props.nextMovesTotal2);
    		if ('nextMovesArrDict2' in $$props) $$invalidate(16, nextMovesArrDict2 = $$props.nextMovesArrDict2);
    		if ('h' in $$props) $$invalidate(6, h = $$props.h);
    		if ('w' in $$props) $$invalidate(7, w = $$props.w);
    	};

    	$$self.$capture_state = () => ({
    		StackedBar: Stacked_bar,
    		NextMoveGraph: Next_move_graph,
    		gameDataStore,
    		selectedSquare,
    		aggNextMove,
    		nextMovesArr,
    		nextMovesArrDict,
    		nextMovesTotal,
    		aggNextMove2,
    		nextMovesArr2,
    		nextMovesTotal2,
    		nextMovesArrDict2,
    		h,
    		w,
    		tooltipIsShown,
    		tooltipData,
    		showTooltip,
    		hideTooltip,
    		sizing,
    		th,
    		bw,
    		$gameDataStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('aggNextMove' in $$props) $$invalidate(0, aggNextMove = $$props.aggNextMove);
    		if ('nextMovesArr' in $$props) $$invalidate(1, nextMovesArr = $$props.nextMovesArr);
    		if ('nextMovesArrDict' in $$props) $$invalidate(15, nextMovesArrDict = $$props.nextMovesArrDict);
    		if ('nextMovesTotal' in $$props) $$invalidate(2, nextMovesTotal = $$props.nextMovesTotal);
    		if ('aggNextMove2' in $$props) $$invalidate(3, aggNextMove2 = $$props.aggNextMove2);
    		if ('nextMovesArr2' in $$props) $$invalidate(4, nextMovesArr2 = $$props.nextMovesArr2);
    		if ('nextMovesTotal2' in $$props) $$invalidate(5, nextMovesTotal2 = $$props.nextMovesTotal2);
    		if ('nextMovesArrDict2' in $$props) $$invalidate(16, nextMovesArrDict2 = $$props.nextMovesArrDict2);
    		if ('h' in $$props) $$invalidate(6, h = $$props.h);
    		if ('w' in $$props) $$invalidate(7, w = $$props.w);
    		if ('tooltipIsShown' in $$props) $$invalidate(8, tooltipIsShown = $$props.tooltipIsShown);
    		if ('tooltipData' in $$props) $$invalidate(9, tooltipData = $$props.tooltipData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		aggNextMove,
    		nextMovesArr,
    		nextMovesTotal,
    		aggNextMove2,
    		nextMovesArr2,
    		nextMovesTotal2,
    		h,
    		w,
    		tooltipIsShown,
    		tooltipData,
    		showTooltip,
    		hideTooltip,
    		sizing,
    		th,
    		bw,
    		nextMovesArrDict,
    		nextMovesArrDict2
    	];
    }

    class Parallel_axis_stacked_bars extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			aggNextMove: 0,
    			nextMovesArr: 1,
    			nextMovesArrDict: 15,
    			nextMovesTotal: 2,
    			aggNextMove2: 3,
    			nextMovesArr2: 4,
    			nextMovesTotal2: 5,
    			nextMovesArrDict2: 16,
    			h: 6,
    			w: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Parallel_axis_stacked_bars",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*aggNextMove*/ ctx[0] === undefined && !('aggNextMove' in props)) {
    			console_1$1.warn("<Parallel_axis_stacked_bars> was created without expected prop 'aggNextMove'");
    		}

    		if (/*nextMovesArr*/ ctx[1] === undefined && !('nextMovesArr' in props)) {
    			console_1$1.warn("<Parallel_axis_stacked_bars> was created without expected prop 'nextMovesArr'");
    		}

    		if (/*nextMovesArrDict*/ ctx[15] === undefined && !('nextMovesArrDict' in props)) {
    			console_1$1.warn("<Parallel_axis_stacked_bars> was created without expected prop 'nextMovesArrDict'");
    		}

    		if (/*nextMovesTotal*/ ctx[2] === undefined && !('nextMovesTotal' in props)) {
    			console_1$1.warn("<Parallel_axis_stacked_bars> was created without expected prop 'nextMovesTotal'");
    		}

    		if (/*aggNextMove2*/ ctx[3] === undefined && !('aggNextMove2' in props)) {
    			console_1$1.warn("<Parallel_axis_stacked_bars> was created without expected prop 'aggNextMove2'");
    		}

    		if (/*nextMovesArr2*/ ctx[4] === undefined && !('nextMovesArr2' in props)) {
    			console_1$1.warn("<Parallel_axis_stacked_bars> was created without expected prop 'nextMovesArr2'");
    		}

    		if (/*nextMovesTotal2*/ ctx[5] === undefined && !('nextMovesTotal2' in props)) {
    			console_1$1.warn("<Parallel_axis_stacked_bars> was created without expected prop 'nextMovesTotal2'");
    		}

    		if (/*nextMovesArrDict2*/ ctx[16] === undefined && !('nextMovesArrDict2' in props)) {
    			console_1$1.warn("<Parallel_axis_stacked_bars> was created without expected prop 'nextMovesArrDict2'");
    		}

    		if (/*h*/ ctx[6] === undefined && !('h' in props)) {
    			console_1$1.warn("<Parallel_axis_stacked_bars> was created without expected prop 'h'");
    		}

    		if (/*w*/ ctx[7] === undefined && !('w' in props)) {
    			console_1$1.warn("<Parallel_axis_stacked_bars> was created without expected prop 'w'");
    		}
    	}

    	get aggNextMove() {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aggNextMove(value) {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesArr() {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesArr(value) {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesArrDict() {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesArrDict(value) {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesTotal() {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesTotal(value) {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get aggNextMove2() {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aggNextMove2(value) {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesArr2() {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesArr2(value) {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesTotal2() {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesTotal2(value) {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextMovesArrDict2() {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextMovesArrDict2(value) {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get h() {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set h(value) {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get w() {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set w(value) {
    		throw new Error("<Parallel_axis_stacked_bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\futureViz\future_viz.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$1 = "src\\components\\futureViz\\future_viz.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i][0];
    	child_ctx[14] = list[i][1];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (201:4) {#if $colorByPieceStore}
    function create_if_block(ctx) {
    	let div;
    	let svg;
    	let each_value = pieceNameColors;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(svg, "width", w);
    			attr_dev(svg, "height", 20);
    			add_location(svg, file$1, 202, 12, 9336);
    			add_location(div, file$1, 201, 8, 9317);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pieceNameColors*/ 0) {
    				each_value = pieceNameColors;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(201:4) {#if $colorByPieceStore}",
    		ctx
    	});

    	return block;
    }

    // (204:16) {#each pieceNameColors as [piece, color], i}
    function create_each_block(ctx) {
    	let g;
    	let rect;
    	let text_1;
    	let t_value = /*piece*/ ctx[13] + "";
    	let t;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			rect = svg_element("rect");
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(rect, "cx", "0");
    			attr_dev(rect, "cy", "10");
    			attr_dev(rect, "height", 15);
    			attr_dev(rect, "width", 15);
    			attr_dev(rect, "fill", /*color*/ ctx[14]);
    			add_location(rect, file$1, 205, 24, 9509);
    			attr_dev(text_1, "x", "15");
    			attr_dev(text_1, "y", "12");
    			add_location(text_1, file$1, 207, 24, 9625);
    			attr_dev(g, "transform", "translate(" + /*i*/ ctx[16] * 65 + ",0)");
    			add_location(g, file$1, 204, 20, 9448);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, rect);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(204:16) {#each pieceNameColors as [piece, color], i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let chart;
    	let t2;
    	let div0;
    	let label;
    	let input;
    	let t3;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;

    	chart = new Parallel_axis_stacked_bars({
    			props: {
    				h,
    				w,
    				aggNextMove: /*aggNextMove*/ ctx[0],
    				nextMovesArr: /*nextMovesArr*/ ctx[1],
    				nextMovesTotal: /*nextMovesTotal*/ ctx[3],
    				nextMovesArrDict: /*nextMovesArrDict*/ ctx[2],
    				aggNextMove2: /*aggNextMove2*/ ctx[4],
    				nextMovesArr2: /*nextMovesArr2*/ ctx[5],
    				nextMovesTotal2: /*nextMovesTotal2*/ ctx[7],
    				nextMovesArrDict2: /*nextMovesArrDict2*/ ctx[6]
    			},
    			$$inline: true
    		});

    	let if_block = /*$colorByPieceStore*/ ctx[8] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Distribution of Next Two Moves";
    			t1 = space();
    			create_component(chart.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			label = element("label");
    			input = element("input");
    			t3 = text("\r\n            Generate colors by piece (default is index)");
    			t4 = space();
    			if (if_block) if_block.c();
    			attr_dev(h1, "align", "center");
    			attr_dev(h1, "font-size", "28");
    			set_style(h1, "margin", "0");
    			set_style(h1, "padding", "0");
    			add_location(h1, file$1, 187, 4, 8681);
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$1, 195, 12, 9053);
    			add_location(label, file$1, 194, 8, 9032);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-direction", "row");
    			add_location(div0, file$1, 193, 4, 8973);
    			attr_dev(div1, "class", "container svelte-1ssh6nf");
    			add_location(div1, file$1, 178, 0, 8412);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			mount_component(chart, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(label, input);
    			append_dev(label, t3);
    			append_dev(div1, t4);
    			if (if_block) if_block.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const chart_changes = {};
    			if (dirty & /*aggNextMove*/ 1) chart_changes.aggNextMove = /*aggNextMove*/ ctx[0];
    			if (dirty & /*nextMovesArr*/ 2) chart_changes.nextMovesArr = /*nextMovesArr*/ ctx[1];
    			if (dirty & /*nextMovesTotal*/ 8) chart_changes.nextMovesTotal = /*nextMovesTotal*/ ctx[3];
    			if (dirty & /*nextMovesArrDict*/ 4) chart_changes.nextMovesArrDict = /*nextMovesArrDict*/ ctx[2];
    			if (dirty & /*aggNextMove2*/ 16) chart_changes.aggNextMove2 = /*aggNextMove2*/ ctx[4];
    			if (dirty & /*nextMovesArr2*/ 32) chart_changes.nextMovesArr2 = /*nextMovesArr2*/ ctx[5];
    			if (dirty & /*nextMovesTotal2*/ 128) chart_changes.nextMovesTotal2 = /*nextMovesTotal2*/ ctx[7];
    			if (dirty & /*nextMovesArrDict2*/ 64) chart_changes.nextMovesArrDict2 = /*nextMovesArrDict2*/ ctx[6];
    			chart.$set(chart_changes);

    			if (/*$colorByPieceStore*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(chart);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const w = 380;
    const h = 720;

    function instance$1($$self, $$props, $$invalidate) {
    	let $gameDataStore;
    	let $colorByPieceStore;
    	validate_store(gameDataStore, 'gameDataStore');
    	component_subscribe($$self, gameDataStore, $$value => $$invalidate(11, $gameDataStore = $$value));
    	validate_store(colorByPieceStore, 'colorByPieceStore');
    	component_subscribe($$self, colorByPieceStore, $$value => $$invalidate(8, $colorByPieceStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Future_viz', slots, []);
    	let aggNextMove = {}; // aggreagate next move (sum over levels)
    	let nextMovesArr = []; // array of moves and counts: eg {"move": "b2g2", count: 42}
    	let nextMovesArrDict = {}; // dict version of nextMovesArr 
    	let nextMovesTotal = 0; // total sum of next moves
    	let aggNextMove2 = {}; // aggreagate next move (sum over levels)
    	let nextMovesArr2 = []; // array of moves and counts: eg {"move": "b2g2", count: 42}
    	let nextMovesArrDict2 = {};
    	let nextMovesTotal2 = 0; // total sum of next moves

    	const unsubscribeFen = fenDataStore.subscribe(newDataArr => {
    		console.log({ newDataArr });

    		$$invalidate(0, aggNextMove = newDataArr.reduce(
    			(previousValue, currentValue, i_reduce) => {
    				if (!currentValue || !currentValue['nxt']) return {
    					...previousValue, // initial val
    					
    				}; // if no moves, don't add to list

    				let newValue = {};

    				Object.entries(currentValue['nxt']).forEach(([_, datum], i) => {
    					// loop over next moves
    					const fen = datum[0];

    					const count = datum[1][0];
    					const san = datum[1][1];
    					const prev = previousValue[fen] ? previousValue[fen][0] : 0; // if not defined, use 0
    					const sum = parseInt(count) + prev;
    					newValue[fen] = [sum, san];
    				});

    				return { ...previousValue, ...newValue }; // overwrite previous values with new sums
    			},
    			{}
    		)); // initial val

    		let accCount = 0; // count previous sums, useful for translating bars
    		let tmpMovesArr = Object.entries(aggNextMove).sort((a, b) => b[1][0] - a[1][0]); // sort by count

    		const nextMovesArrAll = tmpMovesArr.map(([fen, [count, san]]) => {
    			// transform to object from nested arrays
    			if (isNaN(count)) return { san, count: 0, accCount: 0, fen };

    			accCount += count;
    			return { san, count, accCount, fen };
    		});

    		$$invalidate(3, nextMovesTotal = accCount);

    		const nextMovesArrFilt = nextMovesArrAll.filter(({ fen, count }) => {
    			return true; // EXPERIMENTAL -- do not filter
    		});

    		$$invalidate(1, nextMovesArr = [...nextMovesArrFilt]); //, otherMoves]; // add other moves

    		console.log('Parsed next move viz data:', {
    			nextMovesArr,
    			aggNextMove,
    			nextMovesTotal
    		});

    		$$invalidate(2, nextMovesArrDict = nextMovesArr.reduce((p, c, i) => ({ ...p, [c.fen]: { ...c, i } }), {}));

    		// get data for 2 moves in the future 
    		const nextMovesDataArr = nextMovesArr.map(({ fen: fenPrev }, i) => {
    			// get fens at the levels
    			const gameData = ['0', '1', '2', '3'].map(i => {
    				// loop over 4 levels
    				const datum = $gameDataStore[i][fenPrev];

    				if (datum == undefined) {
    					console.warn(`While checking future move 2: Fen (${fenPrev}) not recognized for level ${i}`); // throw user visible error
    					return false; // will be skipped later
    				}

    				return datum;
    			});

    			//console.log({i, gameData});
    			return { fenPrev, gameData };
    		});

    		// aggregate levels and simplify object for each prev fen
    		$$invalidate(4, aggNextMove2 = nextMovesDataArr.map(({ fenPrev, gameData }, i) => {
    			return gameData.reduce(
    				(previousValue, currentValue, i_reduce) => {
    					if (!currentValue) return previousValue; // skip falsy data
    					let newValue = {};

    					Object.entries(currentValue['nxt']).forEach(([_, datum], i) => {
    						// loop over next moves
    						const fen = datum[0];

    						const san = datum[1][1];
    						const prev = previousValue[fen] ? previousValue[fen]['count'] : 0; // if not defined, use 0
    						const count = parseInt(datum[1][0]) + prev;
    						newValue[fen] = { count, san, fenPrev };
    					});

    					return { ...previousValue, ...newValue }; // overwrite previous values with new sums
    				},
    				{}
    			);
    		}).reduce(
    			(prevObj, newItems) => {
    				// combine next fens for each move, combine duplicates
    				/* convert from
           [{[fen]: {count, san, fenPrev}, ...}, // data from move 1
            {[fen]: {count, san, fenPrev}, ...}, // data from move 2
            ... ]  // ect
    convert to 
        [{ fen, count (agg), san, fenPrev: {[fen]: count} }, ...]  // by combining matching fens
    */
    				// update count and prev fen data for each object in newItems 
    				// looking at stuff in prevObj
    				// console.log({prevObj, newItems})
    				Object.keys(newItems).forEach(key => {
    					const newFenCnt = newItems[key]['count'];
    					const newFen = newItems[key]['fenPrev'];

    					if (key in prevObj) {
    						// if previous fen exists, grab data
    						newItems[key] = {
    							...newItems[key],
    							count: newFenCnt + prevObj['count'],
    							prevFens: {
    								...prevObj[key]['prevFens'],
    								[newFen]: newFenCnt
    							}
    						};
    					} else {
    						newItems[key]['prevFens'] = { [newFen]: newFenCnt };
    					}
    				});

    				return { ...prevObj, ...newItems }; // overwrite any duplicate fen objects with new ones
    			},
    			{}
    		));

    		accCount = 0; // count previous sums, useful for translating bars
    		const tmpMovesArr2 = Object.entries(aggNextMove2).sort((a, b) => b[1]['count'] - a[1]['count']); // sort by count

    		const nextMovesArr2All = tmpMovesArr2.map(s => {
    			const [fen, { count, prevFens, san }] = s;

    			if (isNaN(count)) return {
    				san,
    				count: 0,
    				accCount: 0,
    				fen,
    				prevFens: []
    			};

    			// transform to object from nested arrays
    			accCount += count;

    			return { san, count, accCount, fen, prevFens };
    		});

    		$$invalidate(7, nextMovesTotal2 = accCount);
    		$$invalidate(5, nextMovesArr2 = nextMovesArr2All);
    		$$invalidate(6, nextMovesArrDict2 = nextMovesArr2.reduce((p, c, i) => ({ ...p, [c.fen]: { ...c, i } }), {}));

    		// // filter moves with fewer than 1% of total
    		// const otherMoves2 = {
    		//     san: 'Other',
    		//     fen: false,
    		//     count: 0,
    		//     prevFens: {}
    		// }
    		// const nextMovesArr2Filt = nextMovesArr2All.filter(({fen, count}) => {
    		//     if (count*100 > nextMovesTotal2) {
    		//         return true;  // is ok
    		//     }
    		//     // aggregate this move into other
    		//     otherMoves2['count'] += count;
    		//     otherMoves2['prevFens'] = {
    		//         ...otherMoves2['prevFens'],
    		//         [fen]: count,
    		//     }
    		//     return false;  // remove
    		// }); // add other moves
    		// console.log(nextMovesArr2Filt, otherMoves2)
    		// nextMovesArr2 = [...nextMovesArr2Filt, otherMoves2]; // add other moves
    		console.log('Parsed 2 move viz data:', {
    			nextMovesArr2,
    			aggNextMove2,
    			nextMovesTotal2
    		});
    	});

    	// prevent memory leak(s)
    	onDestroy(unsubscribeFen);

    	function toggleColorByPiece(curr) {
    		colorByPieceStore.set(!curr);
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Future_viz> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => toggleColorByPiece($colorByPieceStore);

    	$$self.$capture_state = () => ({
    		Chart: Parallel_axis_stacked_bars,
    		onDestroy,
    		gameDataStore,
    		fenDataStore,
    		colorByPieceStore,
    		pieceNameColors,
    		aggNextMove,
    		nextMovesArr,
    		nextMovesArrDict,
    		nextMovesTotal,
    		aggNextMove2,
    		nextMovesArr2,
    		nextMovesArrDict2,
    		nextMovesTotal2,
    		unsubscribeFen,
    		toggleColorByPiece,
    		w,
    		h,
    		$gameDataStore,
    		$colorByPieceStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('aggNextMove' in $$props) $$invalidate(0, aggNextMove = $$props.aggNextMove);
    		if ('nextMovesArr' in $$props) $$invalidate(1, nextMovesArr = $$props.nextMovesArr);
    		if ('nextMovesArrDict' in $$props) $$invalidate(2, nextMovesArrDict = $$props.nextMovesArrDict);
    		if ('nextMovesTotal' in $$props) $$invalidate(3, nextMovesTotal = $$props.nextMovesTotal);
    		if ('aggNextMove2' in $$props) $$invalidate(4, aggNextMove2 = $$props.aggNextMove2);
    		if ('nextMovesArr2' in $$props) $$invalidate(5, nextMovesArr2 = $$props.nextMovesArr2);
    		if ('nextMovesArrDict2' in $$props) $$invalidate(6, nextMovesArrDict2 = $$props.nextMovesArrDict2);
    		if ('nextMovesTotal2' in $$props) $$invalidate(7, nextMovesTotal2 = $$props.nextMovesTotal2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		aggNextMove,
    		nextMovesArr,
    		nextMovesArrDict,
    		nextMovesTotal,
    		aggNextMove2,
    		nextMovesArr2,
    		nextMovesArrDict2,
    		nextMovesTotal2,
    		$colorByPieceStore,
    		toggleColorByPiece,
    		click_handler
    	];
    }

    class Future_viz extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Future_viz",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    // (33:1) {:catch error}
    function create_catch_block(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*error*/ ctx[2] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("While loading an error occurred: ");
    			t1 = text(t1_value);
    			set_style(p, "color", "red");
    			add_location(p, file, 33, 2, 960);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(33:1) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (27:1) {:then result}
    function create_then_block(ctx) {
    	let div;
    	let currentviz;
    	let t0;
    	let chessboard;
    	let t1;
    	let futureviz;
    	let current;
    	currentviz = new Current_viz({ $$inline: true });
    	chessboard = new Chessboard_1({ $$inline: true });
    	futureviz = new Future_viz({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(currentviz.$$.fragment);
    			t0 = space();
    			create_component(chessboard.$$.fragment);
    			t1 = space();
    			create_component(futureviz.$$.fragment);
    			attr_dev(div, "class", "viz-container svelte-10goixk");
    			add_location(div, file, 27, 2, 846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(currentviz, div, null);
    			append_dev(div, t0);
    			mount_component(chessboard, div, null);
    			append_dev(div, t1);
    			mount_component(futureviz, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(currentviz.$$.fragment, local);
    			transition_in(chessboard.$$.fragment, local);
    			transition_in(futureviz.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(currentviz.$$.fragment, local);
    			transition_out(chessboard.$$.fragment, local);
    			transition_out(futureviz.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(currentviz);
    			destroy_component(chessboard);
    			destroy_component(futureviz);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(27:1) {:then result}",
    		ctx
    	});

    	return block;
    }

    // (25:19)     <p>Loading...</p>   {:then result}
    function create_pending_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading...";
    			add_location(p, file, 25, 2, 807);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(25:19)     <p>Loading...</p>   {:then result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let link;
    	let html;
    	let t0;
    	let main;
    	let header;
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let a;
    	let t5;
    	let current;
    	header = new Header({ $$inline: true });

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 1,
    		error: 2,
    		blocks: [,,,]
    	};

    	handle_promise(/*fetchJson*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			link = element("link");
    			html = element("html");
    			t0 = space();
    			main = element("main");
    			create_component(header.$$.fragment);
    			t1 = space();
    			info.block.c();
    			t2 = space();
    			p = element("p");
    			t3 = text("Build with Svelte. Visit the ");
    			a = element("a");
    			a.textContent = "Svelte tutorial";
    			t5 = text(" to learn how to build Svelte apps.");
    			document.title = "Chess Viz";
    			attr_dev(link, "rel", "icon");
    			attr_dev(link, "type", "image/svg");
    			attr_dev(link, "href", './img/chesspieces/wikipedia/wQ.png');
    			add_location(link, file, 17, 1, 640);
    			attr_dev(html, "lang", "en");
    			add_location(html, file, 18, 1, 723);
    			attr_dev(a, "href", "https://svelte.dev/tutorial");
    			add_location(a, file, 36, 36, 1077);
    			add_location(p, file, 36, 4, 1045);
    			add_location(main, file, 21, 0, 761);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			append_dev(document.head, html);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t2;
    			append_dev(main, t2);
    			append_dev(main, p);
    			append_dev(p, t3);
    			append_dev(p, a);
    			append_dev(p, t5);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link);
    			detach_dev(html);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const jsonFilename = 'games_2022_2M_filt10.json';

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let fetchJson = fetch(jsonFilename).then(res => res.json()).then(data => {
    		gameDataStore.set(data);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		gameDataStore,
    		Chessboard: Chessboard_1,
    		Header,
    		CurrentViz: Current_viz,
    		FutureViz: Future_viz,
    		jsonFilename,
    		fetchJson
    	});

    	$$self.$inject_state = $$props => {
    		if ('fetchJson' in $$props) $$invalidate(0, fetchJson = $$props.fetchJson);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [fetchJson];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
