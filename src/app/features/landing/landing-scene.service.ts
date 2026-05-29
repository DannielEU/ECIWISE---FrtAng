import { Injectable } from '@angular/core';
import type {
  BufferGeometry,
  Points,
  PointsMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

/**
 * Encapsula la escena espacial 3D de la landing (campo de estrellas con
 * parallax). Carga three.js de forma diferida y solo debe usarse en el
 * navegador. Limpia los recursos de WebGL al destruir.
 */
@Injectable()
export class LandingSceneService {
  private renderer?: WebGLRenderer;
  private scene?: Scene;
  private camera?: PerspectiveCamera;
  private stars?: Points;
  private geometry?: BufferGeometry;
  private material?: PointsMaterial;
  private frameId = 0;
  private host?: HTMLElement;
  private pointer = { x: 0, y: 0 };

  /** Inicializa la escena dentro del canvas dado. */
  async init(canvas: HTMLCanvasElement, host: HTMLElement): Promise<void> {
    const THREE = await import('three');
    this.host = host;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, this.aspect(host), 0.1, 1000);
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.resize();

    const count = 1800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 8;
    }
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.material = new THREE.PointsMaterial({
      color: 0xc8102e,
      size: 0.015,
      transparent: true,
      opacity: 0.9,
    });
    this.stars = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.stars);

    window.addEventListener('resize', this.resize);
    window.addEventListener('pointermove', this.onPointerMove);
    this.animate();
  }

  /** Detiene la animación y libera los recursos de WebGL. */
  dispose(): void {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointerMove);
    this.geometry?.dispose();
    this.material?.dispose();
    this.renderer?.dispose();
    this.renderer = undefined;
  }

  private animate = (): void => {
    this.frameId = requestAnimationFrame(this.animate);
    if (!this.stars || !this.camera || !this.renderer || !this.scene) {
      return;
    }
    this.stars.rotation.y += 0.0006;
    this.stars.rotation.x += 0.0002;
    this.camera.position.x += (this.pointer.x * 0.4 - this.camera.position.x) * 0.04;
    this.camera.position.y += (-this.pointer.y * 0.4 - this.camera.position.y) * 0.04;
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  };

  private onPointerMove = (event: PointerEvent): void => {
    this.pointer.x = event.clientX / window.innerWidth - 0.5;
    this.pointer.y = event.clientY / window.innerHeight - 0.5;
  };

  private resize = (): void => {
    if (!this.renderer || !this.camera || !this.host) {
      return;
    }
    const { clientWidth, clientHeight } = this.host;
    this.renderer.setSize(clientWidth, clientHeight, false);
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
  };

  private aspect(host: HTMLElement): number {
    return host.clientWidth / Math.max(host.clientHeight, 1);
  }
}
