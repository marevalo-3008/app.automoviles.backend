import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Pedido, PedidoRelations, Usuario, Producto} from '../models';
import {UsuarioRepository} from './usuario.repository';
import {ProductoRepository} from './producto.repository';

export class PedidoRepository extends DefaultCrudRepository<
  Pedido,
  typeof Pedido.prototype.id_pedido,
  PedidoRelations
> {

  public readonly usuario: BelongsToAccessor<Usuario, typeof Pedido.prototype.id_pedido>;

  public readonly producto: HasOneRepositoryFactory<Producto, typeof Pedido.prototype.id_pedido>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('ProductoRepository') protected productoRepositoryGetter: Getter<ProductoRepository>,
  ) {
    super(Pedido, dataSource);
    this.producto = this.createHasOneRepositoryFactoryFor('producto', productoRepositoryGetter);
    this.registerInclusionResolver('producto', this.producto.inclusionResolver);
    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
  }
}
